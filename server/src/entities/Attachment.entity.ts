import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User.entity';
import { Project } from './Project.entity';
import { Task } from './Task.entity';
import { Team } from './Team.entity';

@Entity('attachments')
export class Attachment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  fileName!: string;

  @Column({ type: 'text' })
  fileUrl!: string;

  @Column({ type: 'varchar', length: 100 })
  fileType!: string;

  @Column({ type: 'int' })
  fileSize!: number;

  @Column({ type: 'uuid', nullable: true })
  projectId!: string | null;

  @Column({ type: 'uuid', nullable: true })
  taskId!: string | null;

  @Column({ type: 'uuid', nullable: true })
  teamId!: string | null;

  @Column({ type: 'uuid' })
  uploadedById!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @ManyToOne(() => Project, (project) => project.attachments, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'projectId' })
  project!: Project | null;

  @ManyToOne(() => Task, (task) => task.attachments, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'taskId' })
  task!: Task | null;

  @ManyToOne(() => Team, (team) => team.attachments, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'teamId' })
  team!: Team | null;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'uploadedById' })
  uploadedBy!: User;
}
