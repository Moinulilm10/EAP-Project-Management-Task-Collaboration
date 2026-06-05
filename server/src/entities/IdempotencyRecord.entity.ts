import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('idempotency_records')
@Index(['idempotencyKey', 'userId'], { unique: true })
export class IdempotencyRecord {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  idempotencyKey!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'varchar', length: 10 })
  method!: string;

  @Column({ type: 'varchar', length: 500 })
  path!: string;

  @Column({ type: 'int' })
  statusCode!: number;

  @Column({ type: 'jsonb' })
  responseBody!: Record<string, unknown>;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  /** 24-hour TTL — records older than this are stale */
  @Column({ type: 'timestamptz' })
  expiresAt!: Date;
}
