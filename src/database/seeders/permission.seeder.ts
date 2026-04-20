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

    // 2️⃣ Convert object → array
    const definitions = Object.values(PERMISSIONS);

    // 3️⃣ Filter + create
    const newPermissions = definitions
      .filter((p) => !existingSet.has(p.action))
      .map((p) => {
        const resource = p.action.split(':')[0];

        return this.permissionRepo.create({
          action: p.action,
          resource,
          description: p.description,
        });
      });

    // 4️⃣ Save in bulk
    if (newPermissions.length) {
      await this.permissionRepo.save(newPermissions);
    }

    console.log('✅ Permissions seeded');
  }
}
