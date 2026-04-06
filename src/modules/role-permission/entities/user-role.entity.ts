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

@Entity('user_roles')
export class UserRoleEntity extends BaseEntity {
  // FK to your existing User entity
  @Column()
  userId: string;

  @ManyToOne(() => RoleEntity, (role) => role.userRoles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;
}
