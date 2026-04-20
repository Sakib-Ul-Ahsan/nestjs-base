import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermissionController } from './controller/role-permission.controller';
import { RolePermissionService } from './service/role-permission.service';
import { PermissionsGuard } from '../auth/guards/permission.guard';
import { AuthModule } from '../auth/auth.module';
import { RoleEntity } from './entities/role.entity';
import { PermissionEntity } from './entities/permission.entity';
import { RolePermissionEntity } from './entities/role-permission.entity';
import { UserRoleEntity } from './entities/user-role.entity';
import { AuditLogModule } from 'src/common/audit/audit-log.module';

@Global()
@Module({
  imports: [
    AuthModule,
    AuditLogModule,
    TypeOrmModule.forFeature([
      RoleEntity,
      PermissionEntity,
      RolePermissionEntity,
      UserRoleEntity,
    ]),
  ],
  controllers: [RolePermissionController],
  providers: [RolePermissionService, PermissionsGuard],
  exports: [RolePermissionService, PermissionsGuard, TypeOrmModule],
})
export class RolePermissionModule {}
