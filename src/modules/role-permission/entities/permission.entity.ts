import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { RolePermissionEntity } from './role-permission.entity';

@Entity('permissions')
export class PermissionEntity extends BaseEntity {
  // e.g. "users:read", "users:write", "orders:delete"
  @Column({ unique: true, name: 'action' })
  action: string;

  // e.g. "users", "orders", "reports"
  @Column({ name: 'resource' })
  resource: string;

  @Column({ nullable: true, name: 'description' })
  description: string;

  @OneToMany(() => RolePermissionEntity, (rp) => rp.permission)
  rolePermissions: RolePermissionEntity[];
}
