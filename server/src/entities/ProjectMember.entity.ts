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
  PROJECT_MANAGER = "project_manager",
  TEAM_MEMBER = "team_member",
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
    default: ProjectMemberRole.TEAM_MEMBER,
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

/**
 * Role hierarchy for project members.
 * Higher values = more permissions.
 */
export const ProjectMemberRoleHierarchy: Record<ProjectMemberRole, number> = {
  [ProjectMemberRole.ADMIN]: 3,
  [ProjectMemberRole.PROJECT_MANAGER]: 2,
  [ProjectMemberRole.TEAM_MEMBER]: 1,
};
