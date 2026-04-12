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
import { UserRoleEntity } from './user-role.entity';

@Entity('roles')
export class RoleEntity extends BaseEntity {
  @Column({ unique: true, name: 'name' })
  name: string; // e.g. "admin", "manager", "viewer"

  @Column({ nullable: true, name: 'description' })
  description: string;

  @OneToMany(() => RolePermissionEntity, (rp) => rp.role, { cascade: true })
  rolePermissions: RolePermissionEntity[];

  @OneToMany(() => UserRoleEntity, (ur) => ur.role)
  userRoles: UserRoleEntity[];
}
