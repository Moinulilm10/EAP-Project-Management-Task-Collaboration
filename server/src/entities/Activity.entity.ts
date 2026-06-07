import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("activities")
export class Activity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255 })
  user!: string;

  @Column({ type: "varchar", length: 255 })
  action!: string;

  @Column({ type: "varchar", length: 255, default: "" })
  target!: string;

  @Column({ type: "varchar", length: 50, default: "" })
  status!: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;
}
