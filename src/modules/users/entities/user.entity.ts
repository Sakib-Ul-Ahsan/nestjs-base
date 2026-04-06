import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ default: true })
  isActive: boolean;
}
