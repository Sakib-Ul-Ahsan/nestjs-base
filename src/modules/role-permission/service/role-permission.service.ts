import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from '../entities/role.entity';
import { PermissionEntity } from '../entities/permission.entity';
import { RolePermissionEntity } from '../entities/role-permission.entity';
import { UserRoleEntity } from '../entities/user-role.entity';

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
  ) {}

  // ── Roles ────────────────────────────────────────────────────────────

  async createRole(name: string, description?: string): Promise<RoleEntity> {
    const existing = await this.roleRepo.findOne({ where: { name } });
    if (existing) throw new ConflictException(`Role "${name}" already exists`);
    return this.roleRepo.save(this.roleRepo.create({ name, description }));
  }

  async getAllRoles(): Promise<RoleEntity[]> {
    return this.roleRepo.find({
      relations: ['rolePermissions', 'rolePermissions.permission'],
    });
  }

  // ── Permissions ──────────────────────────────────────────────────────

  async createPermission(
    action: string,
    resource: string,
    description?: string,
  ): Promise<PermissionEntity> {
    const existing = await this.permRepo.findOne({ where: { action } });
    if (existing)
      throw new ConflictException(`Permission "${action}" already exists`);
    return this.permRepo.save(
      this.permRepo.create({ action, resource, description }),
    );
  }

  async getAllPermissions(): Promise<PermissionEntity[]> {
    return this.permRepo.find();
  }

  // ── Assign Permission to Role ────────────────────────────────────────

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
