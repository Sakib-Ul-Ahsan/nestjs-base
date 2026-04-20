import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { UserRoleEntity } from 'src/modules/role-permission/entities/user-role.entity';
import { Exclude } from 'class-transformer';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column({ unique: true, length: 100, name: 'email' })
  email: string;

  @Column({ length: 100, name: 'name' })
  name: string;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ name: 'password', select: false })
  password: string;

  @OneToMany(() => UserRoleEntity, (userRole) => userRole.user)
  userRoles: UserRoleEntity[];
}
