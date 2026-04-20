import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRoleEntity } from 'src/modules/role-permission/entities/user-role.entity';
import { Repository } from 'typeorm';
import { PERMISSIONS_KEY } from '../decorators/permission.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(UserRoleEntity)
    private userRoleRepo: Repository<UserRoleEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get required permissions from decorator metadata
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // No permissions required → allow
    if (!requiredPermissions || requiredPermissions.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Set by your JWT/Auth guard

    if (!user) throw new ForbiddenException('No authenticated user');

    // Fetch all roles + their permissions for this user in one query
    const userRoles = await this.userRoleRepo.find({
      where: { userId: user.id },
      relations: [
        'role',
        'role.rolePermissions',
        'role.rolePermissions.permission',
      ],
    });

    const isSuperAdmin = userRoles.some((r) => r.role?.name === 'SUPER_ADMIN');

    if (isSuperAdmin) return true;

    // Flatten all permission actions the user has
    const userPermissions = new Set<string>();
    for (const userRole of userRoles) {
      for (const rp of userRole.role?.rolePermissions ?? []) {
        userPermissions.add(rp.permission.action);
      }
    }

    // Check every required permission is present
    const hasAll = requiredPermissions.every((p) => userPermissions.has(p));
    if (!hasAll) throw new ForbiddenException('Insufficient permissions');

    return true;
  }
}
