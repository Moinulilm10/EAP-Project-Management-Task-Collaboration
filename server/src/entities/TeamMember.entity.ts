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
import { User } from "./User.entity";

export enum TeamRoleName {
  ADMIN = "Admin",
  MEMBER = "Member",
}

@Entity("team_members")
@Index(["teamId"])
@Index(["userId"])
@Unique(["teamId", "userId"])
export class TeamMember {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  teamId!: string;

  @Column({ type: "uuid" })
  userId!: string;

  @Column({
    type: "enum",
    enum: TeamRoleName,
    default: TeamRoleName.MEMBER,
  })
  role!: TeamRoleName;

  @ManyToOne(() => Team, (team) => team.members, { onDelete: "CASCADE" })
  @JoinColumn({ name: "teamId" })
  team!: Team;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: User;
}
