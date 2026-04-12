import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Column,
} from 'typeorm';
import { RoleEntity } from './role.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';

@Entity('user_roles')
export class UserRoleEntity extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.userRoles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'role_id' })
  roleId: string;

  @ManyToOne(() => RoleEntity, (role) => role.userRoles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;
}
