import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { Team } from "./Team.entity";
import { Project } from "./Project.entity";

@Entity("project_teams")
@Index(["teamId"])
@Index(["projectId"])
@Unique(["teamId", "projectId"])
export class ProjectTeam {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  teamId!: string;

  @Column({ type: "uuid" })
  projectId!: string;

  @ManyToOne(() => Team, (team) => team.projectTeams, { onDelete: "CASCADE" })
  @JoinColumn({ name: "teamId" })
  team!: Team;

  @ManyToOne(() => Project, { onDelete: "CASCADE" })
  @JoinColumn({ name: "projectId" })
  project!: Project;
}
