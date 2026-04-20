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

  @Column({ nullable: true })
  userId: string;

  @Column()
  method: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  ip: string;

  @Column({ type: 'jsonb', nullable: true })
  requestBody: any;

  @Column({ type: 'jsonb', nullable: true })
  responseBody: any;

  @Column()
  statusCode: number;

  @Column()
  durationMs: number;

  @Column({ nullable: true })
  userAgent: string;

  @CreateDateColumn()
  createdAt: Date;
}