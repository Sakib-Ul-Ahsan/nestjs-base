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
  @Column({ unique: true })
  action: string;

  // e.g. "users", "orders", "reports"
  @Column()
  resource: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => RolePermissionEntity, (rp) => rp.permission)
  rolePermissions: RolePermissionEntity[];
}
