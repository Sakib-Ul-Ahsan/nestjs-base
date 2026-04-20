import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserService } from './service/users.service';
import { UserController } from './controller/user.controller';
import { RoleEntity } from '../role-permission/entities/role.entity';
import { UserRoleEntity } from '../role-permission/entities/user-role.entity';
import { SystemLogEntity } from 'src/common/audit/system-audit/system-log.entity';
import { SystemLogService } from 'src/common/audit/system-audit/system-log.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      RoleEntity,
      UserRoleEntity,
      SystemLogEntity,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, SystemLogService],
  exports: [TypeOrmModule, UserService, SystemLogService],
})
export class UsersModule {}
