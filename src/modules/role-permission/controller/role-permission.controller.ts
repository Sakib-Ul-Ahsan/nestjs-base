import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Put,
  Query,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { RequirePermissions } from 'src/modules/auth/decorators/permission.decorator';
import { PermissionsGuard } from 'src/modules/auth/guards/permission.guard';
import { RolePermissionService } from '../service/role-permission.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateRoleDto, UpdateRoleDto } from '../dto/create-role.dto';
import {
  CreatePermissionDto,
  UpdatePermissionDto,
} from '../dto/create-permission.dto';
import { FilterRoleDto } from '../dto/filter-role.dto';
import { FilterPermissionDto } from '../dto/filter-permission.dto';
import {
  AssignPermissionsToRoleDto,
  RemovePermissionsFromRoleDto,
} from '../dto/assign-permissions.dto';

@Controller('role-permission')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RolePermissionController {
  constructor(private readonly service: RolePermissionService) {}

  @Post('roles')
  @RequirePermissions('roles:write')
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, description: 'Role created successfully' })
  createRole(@Body() dto: CreateRoleDto, @Req() req) {
    const actor = req.user;
    return this.service.createRole(dto.name, dto.description, actor, req);
  }

  @Get('roles')
  @ApiOperation({ summary: 'Get all roles' })
  getAllRoles(@Query() query: FilterRoleDto, @Req() req) {
    return this.service.getAllRoles();
  }

  @Put('roles/:id')
  @RequirePermissions('roles:write')
  @ApiOperation({ summary: 'Update a role' })
  @ApiParam({ name: 'id', example: 'role-uuid' })
  @ApiResponse({ status: 200, description: 'Role updated successfully' })
  updateRole(@Param('id') id: string, @Body() dto: UpdateRoleDto, @Req() req) {
    const actor = req.user;
    return this.service.updateRole(id, dto, actor, req);
  }

  @Delete('roles/:id')
  @RequirePermissions('roles:write')
  @ApiOperation({ summary: 'Delete a role' })
  @ApiParam({ name: 'id', example: 'role-uuid' })
  @ApiResponse({ status: 200, description: 'Role deleted successfully' })
  deleteRole(@Param('id') id: string, @Req() req) {
    const actor = req.user;
    return this.service.deleteRole(id, actor, req);
  }

  @Post('permissions')
  @RequirePermissions('permissions:write')
  @ApiOperation({ summary: 'Create a new permission' })
  @ApiResponse({ status: 201, description: 'Permission created successfully' })
  createPermission(@Body() dto: CreatePermissionDto, @Req() req) {
    const actor = req.user;
    return this.service.createPermission(
      dto.action,
      dto.resource,
      dto.description,
      actor,
      req,
    );
  }

  @Get('permissions')
  @RequirePermissions('permissions:read')
  @ApiOperation({ summary: 'Get permissions (paginated or all)' })
  getAllPermissions(@Query() query: FilterPermissionDto, @Req() req) {
    if (query.showAll === 'true') {
      return this.service.getAllPermissions(); // full list
    }

    return this.service.getPermissionsPaginated(query); // paginated
  }

  @Put('permissions/:id')
  @RequirePermissions('permissions:write')
  @ApiOperation({ summary: 'Update a permission' })
  @ApiParam({ name: 'id', example: 'permission-uuid' })
  @ApiResponse({ status: 200, description: 'Permission updated successfully' })
  updatePermission(
    @Param('id') id: string,
    @Body() dto: UpdatePermissionDto,
    @Req() req,
  ) {
    const actor = req.user;
    return this.service.updatePermission(id, dto, actor, req);
  }

  @Delete('permissions/:id')
  @RequirePermissions('permissions:write')
  @ApiOperation({ summary: 'Delete a permission' })
  @ApiParam({ name: 'id', example: 'permission-uuid' })
  @ApiResponse({ status: 200, description: 'Permission deleted successfully' })
  deletePermission(@Param('id') id: string, @Req() req) {
    const actor = req.user;
    return this.service.deletePermission(id, actor, req);
  }

  @Post('assign-permission/:roleId/permissions')
  @RequirePermissions('roles:write')
  @ApiOperation({ summary: 'Assign multiple permissions to role' })
  @ApiParam({ name: 'roleId', example: 'role-uuid' })
  @ApiResponse({
    status: 201,
    description: 'Permissions assigned successfully',
  })
  assignPermissionsToRole(
    @Param('roleId', new ParseUUIDPipe()) roleId: string,
    @Body() dto: AssignPermissionsToRoleDto,
    @Req() req,
  ) {
    const actor = req.user;
    return this.service.assignPermissionsToRole(roleId, dto.permissionIds, actor, req);
  }

  @Delete('roles/:roleId/permissions')
  @RequirePermissions('roles:write')
  @ApiOperation({ summary: 'Remove multiple permissions from role' })
  @ApiParam({ name: 'roleId', example: 'role-uuid' })
  @ApiResponse({ status: 200, description: 'Permissions removed successfully' })
  removePermissionsFromRole(
    @Param('roleId') roleId: string,
    @Body() dto: RemovePermissionsFromRoleDto,
    @Req() req,
  ) {
    const actor = req.user;
    return this.service.removePermissionsFromRole(roleId, dto.permissionIds, actor, req);
  }

  @Post('users/:userId/roles/:roleId')
  @RequirePermissions('roles:write')
  @ApiOperation({ summary: 'Assign role to user' })
  @ApiParam({ name: 'userId', example: 'user-uuid' })
  @ApiParam({ name: 'roleId', example: 'role-uuid' })
  assignRoleToUser(
    @Param('userId') userId: string,
    @Param('roleId') roleId: string,
  ) {
    return this.service.assignRoleToUser(userId, roleId);
  }

  @Get('users/:userId/permissions')
  @RequirePermissions('roles:read')
  @ApiOperation({ summary: 'Get user permissions' })
  @ApiParam({ name: 'userId', example: 'user-uuid' })
  getUserPermissions(@Param('userId') userId: string) {
    return this.service.getUserPermissions(userId);
  }
}
