import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { SystemAction } from './system-audit.enum';

@Entity('system_logs')
export class SystemLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: SystemAction })
  action: SystemAction;

  @Column()
  entityType: string; // USER, TASK, ORDER

  @Column()
  entityId: string;

  @Column({ nullable: true })
  userId: string; // actor (who performed action)

  @Column({ nullable: true })
  targetUserId: string; // in case of user operations

  @Column({ type: 'jsonb', nullable: true })
  oldValues: any;

  @Column({ type: 'jsonb', nullable: true })
  newValues: any;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @Column({ nullable: true })
  ip: string;

  @CreateDateColumn()
  createdAt: Date;
}
