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

  @Column({ name: 'entity_type' })
  entityType: string; // USER, TASK, ORDER

  @Column({ name: 'entity_id' })
  entityId: string;

  @Column({ name: 'user_id', nullable: true })
  userId: string; // actor (who performed action)

  @Column({ name: 'target_user_id', nullable: true })
  targetUserId: string; // in case of user operations

  @Column({ name: 'old_values', type: 'jsonb', nullable: true })
  oldValues: any;

  @Column({ name: 'new_values', type: 'jsonb', nullable: true })
  newValues: any;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @Column({ nullable: true })
  ip: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
