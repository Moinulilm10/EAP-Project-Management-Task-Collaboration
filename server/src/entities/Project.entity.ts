import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ProjectMember } from "./ProjectMember.entity";
import { Task } from "./Task.entity";
import { User } from "./User.entity";
import { ProjectTeam } from "./ProjectTeam.entity";

export enum ProjectStatus {
  ACTIVE = "active",
  COMPLETED = "completed",
  ON_HOLD = "on_hold",
}

@Index(["status", "deadline", "deletedAt"])
@Entity("projects")
export class Project {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 200 })
  name!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({
    type: "enum",
    enum: ProjectStatus,
    default: ProjectStatus.ACTIVE,
  })
  status!: ProjectStatus;

  @Column({ type: "int", default: 0 })
  progress!: number;

  @Column({ type: "timestamptz", nullable: true })
  deadline!: Date | null;

  @Column({ type: "uuid" })
  ownerId!: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;

  @DeleteDateColumn({ type: "timestamptz", nullable: true })
  deletedAt!: Date | null;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "ownerId" })
  owner!: User;

  @OneToMany(() => Task, (task) => task.project)
  tasks!: Task[];

  @OneToMany(() => ProjectMember, (member) => member.project)
  projectMembers!: ProjectMember[];

  @OneToMany(() => ProjectTeam, (projectTeam) => projectTeam.project)
  projectTeams!: ProjectTeam[];
}
