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
import { Task } from "./Task.entity";

@Entity("task_teams")
@Index(["teamId"])
@Index(["taskId"])
@Unique(["teamId", "taskId"])
export class TaskTeam {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  teamId!: string;

  @Column({ type: "uuid" })
  taskId!: string;

  @ManyToOne(() => Team, (team) => team.taskTeams, { onDelete: "CASCADE" })
  @JoinColumn({ name: "teamId" })
  team!: Team;

  @ManyToOne(() => Task, { onDelete: "CASCADE" })
  @JoinColumn({ name: "taskId" })
  task!: Task;
}
