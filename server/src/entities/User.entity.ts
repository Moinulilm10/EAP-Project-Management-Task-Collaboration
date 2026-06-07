import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ProjectMember } from "./ProjectMember.entity";
import { RefreshToken } from "./RefreshToken.entity";

export enum AuthProvider {
  CREDENTIALS = "credentials",
  GOOGLE = "google",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Index({ unique: true })
  @Column({ type: "varchar", length: 255, unique: true })
  email!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  passwordHash!: string | null;

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({
    type: "enum",
    enum: AuthProvider,
    default: AuthProvider.CREDENTIALS,
  })
  provider!: AuthProvider;

  @Column({ type: "varchar", length: 255, nullable: true })
  googleId!: string | null;

  @Column({ type: "varchar", length: 1000, nullable: true })
  picture!: string | null;

  @Column({ type: "text", nullable: true })
  bio!: string | null;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;

  @OneToMany(() => RefreshToken, (token) => token.user)
  refreshTokens!: RefreshToken[];

  @OneToMany(() => ProjectMember, (membership) => membership.user)
  projectMemberships!: ProjectMember[];
}
