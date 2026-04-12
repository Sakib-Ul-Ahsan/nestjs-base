import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionEntity } from 'src/modules/role-permission/entities/permission.entity';
import { PERMISSIONS } from 'src/common/constants/permission.constant';

@Injectable()
export class PermissionSeeder {
  constructor(
    @InjectRepository(PermissionEntity)
    private permissionRepo: Repository<PermissionEntity>,
  ) {}

  async seed() {
    // 1️⃣ Fetch existing permissions
    const existing = await this.permissionRepo.find();
    const existingSet = new Set(existing.map((p) => p.action));

    // 2️⃣ Filter out already existing permissions
    const newPermissions = PERMISSIONS.filter(
      (p) => !existingSet.has(p.action),
    ).map((p) => {
      const [resource] = p.action.split(':'); // e.g., 'users:read' -> 'users'

      return this.permissionRepo.create({
        action: p.action,
        resource,
        description: p.description, // ✅ use description from constant
      });
    });

    // 3️⃣ Save new permissions
    if (newPermissions.length) {
      await this.permissionRepo.save(newPermissions);
    }

    console.log('✅ Permissions seeded with descriptions');
  }
}
