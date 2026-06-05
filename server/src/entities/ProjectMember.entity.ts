import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { Project } from "./Project.entity";
import { User } from "./User.entity";

export enum ProjectMemberRole {
  ADMIN = "admin",
  MEMBER = "member",
}

@Entity("project_members")
@Index(["projectId"])
@Index(["userId"])
@Unique(["projectId", "userId"])
export class ProjectMember {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  projectId!: string;

  @Column({ type: "uuid" })
  userId!: string;

  @Column({
    type: "enum",
    enum: ProjectMemberRole,
    default: ProjectMemberRole.MEMBER,
  })
  role!: ProjectMemberRole;

  @ManyToOne(() => Project, (project) => project.projectMembers, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "projectId" })
  project!: Project;

  @ManyToOne(() => User, (user) => user.projectMemberships, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  user!: User;
}
