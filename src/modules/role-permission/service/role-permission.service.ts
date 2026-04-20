import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { RoleEntity } from '../entities/role.entity';
import { PermissionEntity } from '../entities/permission.entity';
import { RolePermissionEntity } from '../entities/role-permission.entity';
import { UserRoleEntity } from '../entities/user-role.entity';
import { UpdateRoleDto } from '../dto/create-role.dto';
import { UpdatePermissionDto } from '../dto/create-permission.dto';
import { FilterPermissionDto } from '../dto/filter-permission.dto';
import { SystemLogService } from 'src/common/audit/system-audit/system-log.service';
import { SystemAction } from 'src/common/audit/system-audit/system-audit.enum';

@Injectable()
export class RolePermissionService {
  constructor(
    @InjectRepository(RoleEntity) private roleRepo: Repository<RoleEntity>,
    @InjectRepository(PermissionEntity)
    private permRepo: Repository<PermissionEntity>,
    @InjectRepository(RolePermissionEntity)
    private rpRepo: Repository<RolePermissionEntity>,
    @InjectRepository(UserRoleEntity)
    private urRepo: Repository<UserRoleEntity>,
    private systemLogService: SystemLogService,
  ) {}

  async createRole(
    name: string,
    description?: string,
    actor?: any,
    req?: any,
  ): Promise<RoleEntity> {
    const existing = await this.roleRepo.findOne({ where: { name } });
    if (existing) throw new ConflictException(`Role name already exists`);

    const role = await this.roleRepo.save(
      this.roleRepo.create({ name, description }),
    );

    this.systemLogService.log({
      action: SystemAction.ROLE_CREATED,
      entityType: 'ROLE',
      entityId: role.id,
      userId: actor?.id,
      ip: req?.ip,
      newValues: {
        name: role.name,
        description: role.description,
      },
    });

    return role;
  }

  async getAllRoles(): Promise<RoleEntity[]> {
    return this.roleRepo.find({
      relations: ['rolePermissions', 'rolePermissions.permission'],
    });
  }

  async updateRole(
    id: string,
    dto: UpdateRoleDto,
    actor?: any,
    req?: any,
  ): Promise<RoleEntity> {
    const role = await this.roleRepo.findOne({ where: { id } });

    if (!role) throw new NotFoundException('Role not found');

    const oldValues = {
      name: role.name,
      description: role.description,
    };

    Object.assign(role, dto);

    const updated = await this.roleRepo.save(role);

    this.systemLogService.log({
      action: SystemAction.ROLE_UPDATED,
      entityType: 'ROLE',
      entityId: id,
      userId: actor?.id,
      ip: req?.ip,
      oldValues,
      newValues: {
        name: updated.name,
        description: updated.description,
      },
    });

    return updated;
  }

  async deleteRole(
    id: string,
    actor?: any,
    req?: any,
  ): Promise<{ success: boolean }> {
    const role = await this.roleRepo.findOne({ where: { id } });

    if (!role) throw new NotFoundException('Role not found');

    await this.roleRepo.delete(id);

    this.systemLogService.log({
      action: SystemAction.ROLE_DELETED,
      entityType: 'ROLE',
      entityId: id,
      userId: actor?.id,
      ip: req?.ip,
      oldValues: {
        name: role.name,
        description: role.description,
      },
    });

    return { success: true };
  }

  async createPermission(
    action: string,
    resource: string,
    description?: string,
    actor?: any,
    req?: any,
  ): Promise<PermissionEntity> {
    const existing = await this.permRepo.findOne({ where: { action } });
    if (existing)
      throw new ConflictException(`Permission "${action}" already exists`);

    const permission = await this.permRepo.save(
      this.permRepo.create({ action, resource, description }),
    );

    this.systemLogService.log({
      action: SystemAction.PERMISSION_CREATED,
      entityType: 'PERMISSION',
      entityId: permission.id,
      userId: actor?.id,
      ip: req?.ip,
      newValues: {
        action: permission.action,
        resource: permission.resource,
        description: permission.description,
      },
    });

    return permission;
  }

  async getAllPermissions(): Promise<PermissionEntity[]> {
    return this.permRepo.find();
  }

  async getPermissionsPaginated(query: FilterPermissionDto) {
    const { page = 1, limit = 10, action, resource, description } = query;

    const qb = this.permRepo.createQueryBuilder('perm');

    if (action) {
      qb.andWhere('perm.action ILIKE :action', { action: `%${action}%` });
    }

    if (resource) {
      qb.andWhere('perm.resource ILIKE :resource', {
        resource: `%${resource}%`,
      });
    }

    if (description) {
      qb.andWhere('perm.description ILIKE :description', {
        description: `%${description}%`,
      });
    }

    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async updatePermission(
    id: string,
    dto: UpdatePermissionDto,
    actor?: any,
    req?: any,
  ): Promise<PermissionEntity> {
    const permission = await this.permRepo.findOne({ where: { id } });

    if (!permission) throw new NotFoundException('Permission not found');

    const oldValues = {
      action: permission.action,
      resource: permission.resource,
      description: permission.description,
    };

    Object.assign(permission, dto);

    const updated = await this.permRepo.save(permission);

    this.systemLogService.log({
      action: SystemAction.PERMISSION_UPDATED,
      entityType: 'PERMISSION',
      entityId: id,
      userId: actor?.id,
      ip: req?.ip,
      oldValues,
      newValues: {
        action: updated.action,
        resource: updated.resource,
        description: updated.description,
      },
    });

    return updated;
  }

  async deletePermission(
    id: string,
    actor?: any,
    req?: any,
  ): Promise<{ success: boolean }> {
    const permission = await this.permRepo.findOne({ where: { id } });

    if (!permission) throw new NotFoundException('Permission not found');

    await this.permRepo.delete(id);

    this.systemLogService.log({
      action: SystemAction.PERMISSION_DELETED,
      entityType: 'PERMISSION',
      entityId: id,
      userId: actor?.id,
      ip: req?.ip,
      oldValues: {
        action: permission.action,
        resource: permission.resource,
        description: permission.description,
      },
    });

    return { success: true };
  }

  // ── Assign Multiple Permissions to Role ──────────────────────────────────

  async assignPermissionsToRole(
    roleId: string,
    permissionIds: string[],
    actor?: any,
    req?: any,
  ): Promise<{ success: boolean; assigned: number; skipped: number }> {
    // 1. Validate role
    const role = await this.roleRepo.findOne({
      where: { id: roleId },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // 2. Fetch permissions using proper IN query
    const permissions = await this.permRepo.find({
      where: { id: In(permissionIds) },
    });

    if (!permissions.length) {
      throw new NotFoundException('No valid permissions found');
    }

    // 3. Fetch already assigned permissions in one query
    const existingRelations = await this.rpRepo.find({
      where: {
        role: { id: roleId },
        permission: { id: In(permissionIds) },
      },
      relations: ['permission'],
    });

    const existingIds = new Set(existingRelations.map((r) => r.permission.id));

    let assigned = 0;
    let skipped = 0;
    const assignedPermissionNames: string[] = [];

    // 4. Assign missing permissions only
    for (const permission of permissions) {
      if (existingIds.has(permission.id)) {
        skipped++;
        continue;
      }

      await this.rpRepo.save(
        this.rpRepo.create({
          role,
          permission,
        }),
      );

      assigned++;
      assignedPermissionNames.push(permission.action);
    }

    this.systemLogService.log({
      action: SystemAction.ROLE_PERMISSIONS_ASSIGNED,
      entityType: 'ROLE',
      entityId: roleId,
      userId: actor?.id,
      ip: req?.ip,
      metadata: {
        roleName: role.name,
        permissionsAssigned: assignedPermissionNames,
        assigned,
        skipped,
      },
    });

    return {
      success: true,
      assigned,
      skipped,
    };
  }

  async removePermissionsFromRole(
    roleId: string,
    permissionIds: string[],
    actor?: any,
    req?: any,
  ): Promise<{ success: boolean; removed: number; notFound: number }> {
    const role = await this.roleRepo.findOne({ where: { id: roleId } });
    if (!role) throw new NotFoundException('Role not found');

    let removed = 0;
    let notFound = 0;
    const removedPermissionIds: string[] = [];

    for (const permissionId of permissionIds) {
      const rp = await this.rpRepo.findOne({
        where: { role: { id: roleId }, permission: { id: permissionId } },
        relations: ['permission'],
      });

      if (rp) {
        await this.rpRepo.remove(rp);
        removed++;
        removedPermissionIds.push(rp.permission.action);
      } else {
        notFound++;
      }
    }

    this.systemLogService.log({
      action: SystemAction.ROLE_PERMISSIONS_REMOVED,
      entityType: 'ROLE',
      entityId: roleId,
      userId: actor?.id,
      ip: req?.ip,
      metadata: {
        roleName: role.name,
        permissionsRemoved: removedPermissionIds,
        removed,
        notFound,
      },
    });

    return { success: true, removed, notFound };
  }

  // ── Assign Permission to Role (Legacy - Single) ──────────────────────

  async assignPermissionToRole(
    roleId: string,
    permissionId: string,
  ): Promise<RolePermissionEntity> {
    const role = await this.roleRepo.findOne({ where: { id: roleId } });
    if (!role) throw new NotFoundException('Role not found');

    const permission = await this.permRepo.findOne({
      where: { id: permissionId },
    });
    if (!permission) throw new NotFoundException('Permission not found');

    const existing = await this.rpRepo.findOne({
      where: { role: { id: roleId }, permission: { id: permissionId } },
    });
    if (existing)
      throw new ConflictException('Permission already assigned to role');

    return this.rpRepo.save(this.rpRepo.create({ role, permission }));
  }

  async removePermissionFromRole(
    roleId: string,
    permissionId: string,
  ): Promise<void> {
    const rp = await this.rpRepo.findOne({
      where: { role: { id: roleId }, permission: { id: permissionId } },
    });
    if (!rp) throw new NotFoundException('Assignment not found');
    await this.rpRepo.remove(rp);
  }

  // ── Assign Role to User ──────────────────────────────────────────────

  async assignRoleToUser(
    userId: string,
    roleId: string,
  ): Promise<UserRoleEntity> {
    const role = await this.roleRepo.findOne({ where: { id: roleId } });
    if (!role) throw new NotFoundException('Role not found');

    const existing = await this.urRepo.findOne({
      where: { userId, role: { id: roleId } },
    });
    if (existing) throw new ConflictException('Role already assigned to user');

    return this.urRepo.save(this.urRepo.create({ userId, role }));
  }

  async getUserPermissions(userId: string): Promise<string[]> {
    const userRoles = await this.urRepo.find({
      where: { userId },
      relations: [
        'role',
        'role.rolePermissions',
        'role.rolePermissions.permission',
      ],
    });

    const permissions = new Set<string>();
    for (const ur of userRoles) {
      for (const rp of ur.role?.rolePermissions ?? []) {
        permissions.add(rp.permission.action);
      }
    }
    return [...permissions];
  }
}
