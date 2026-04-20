import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('audit_logs')
export class AuditLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @Column()
  method: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  ip: string;

  @Column({ name: 'request_body', type: 'jsonb', nullable: true })
  requestBody: any;

  @Column({ name: 'response_body', type: 'jsonb', nullable: true })
  responseBody: any;

  @Column({ name: 'status_code' })
  statusCode: number;

  @Column({ name: 'duration_ms' })
  durationMs: number;

  @Column({ name: 'user_agent', nullable: true })
  userAgent: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}