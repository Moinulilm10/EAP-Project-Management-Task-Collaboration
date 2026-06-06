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
import { Role } from "./Role.entity";

export enum ProjectRoleName {
  ADMIN = "Admin",
  PROJECT_MANAGER = "Project Manager",
  TEAM_MEMBER = "Team Member",
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

  @Column({ type: "uuid", nullable: true })
  roleId!: string | null;

  @ManyToOne(() => Role, { eager: true, onDelete: "SET NULL", nullable: true })
  @JoinColumn({ name: "roleId" })
  role!: Role | null;

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
export const ProjectMemberRoleHierarchy: Record<ProjectRoleName, number> = {
  [ProjectRoleName.ADMIN]: 3,
  [ProjectRoleName.PROJECT_MANAGER]: 2,
  [ProjectRoleName.TEAM_MEMBER]: 1,
};
