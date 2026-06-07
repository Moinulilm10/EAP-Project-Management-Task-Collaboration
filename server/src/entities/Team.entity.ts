import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";

import { TeamMember } from "./TeamMember.entity";
import { ProjectTeam } from "./ProjectTeam.entity";
import { TaskTeam } from "./TaskTeam.entity";

@Entity("teams")
export class Team {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 200 })
  name!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({ type: "int", default: 10 })
  maxMembers!: number;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;

  @DeleteDateColumn({ type: "timestamptz", nullable: true })
  deletedAt!: Date | null;

  @OneToMany(() => TeamMember, (teamMember) => teamMember.team)
  members!: TeamMember[];

  @OneToMany(() => ProjectTeam, (projectTeam) => projectTeam.team)
  projectTeams!: ProjectTeam[];

  @OneToMany(() => TaskTeam, (taskTeam) => taskTeam.team)
  taskTeams!: TaskTeam[];
}
