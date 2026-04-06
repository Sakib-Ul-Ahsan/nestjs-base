import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { RequirePermissions } from 'src/modules/auth/decorators/permission.decorator';
import { PermissionsGuard } from 'src/modules/auth/guards/permission.guard';
import { RolePermissionService } from '../service/role-permission.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('role-permission')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RolePermissionController {
  constructor(private readonly service: RolePermissionService) {}

  @Post('roles')
  @RequirePermissions('roles:write')
  createRole(@Body() body: { name: string; description?: string }) {
    return this.service.createRole(body.name, body.description);
  }

  @Get('roles')
  // @RequirePermissions('roles:read')
  getAllRoles() {
    return this.service.getAllRoles();
  }

  @Post('permissions')
  @RequirePermissions('permissions:write')
  createPermission(
    @Body() body: { action: string; resource: string; description?: string },
  ) {
    return this.service.createPermission(
      body.action,
      body.resource,
      body.description,
    );
  }

  @Get('permissions')
  @RequirePermissions('permissions:read')
  getAllPermissions() {
    return this.service.getAllPermissions();
  }

  @Post('roles/:roleId/permissions/:permissionId')
  @RequirePermissions('roles:write')
  assignPermission(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string,
  ) {
    return this.service.assignPermissionToRole(roleId, permissionId);
  }

  @Delete('roles/:roleId/permissions/:permissionId')
  @RequirePermissions('roles:write')
  removePermission(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string,
  ) {
    return this.service.removePermissionFromRole(roleId, permissionId);
  }

  @Post('users/:userId/roles/:roleId')
  @RequirePermissions('roles:write')
  assignRoleToUser(
    @Param('userId') userId: string,
    @Param('roleId') roleId: string,
  ) {
    return this.service.assignRoleToUser(userId, roleId);
  }

  @Get('users/:userId/permissions')
  @RequirePermissions('roles:read')
  getUserPermissions(@Param('userId') userId: string) {
    return this.service.getUserPermissions(userId);
  }
}
