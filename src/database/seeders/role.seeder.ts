import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from 'src/modules/role-permission/entities/role.entity';
import { UserRoleEntity } from 'src/modules/role-permission/entities/user-role.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RoleSeeder {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepo: Repository<RoleEntity>,

    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,

    @InjectRepository(UserRoleEntity)
    private userRoleRepo: Repository<UserRoleEntity>,
  ) {}

  async seed() {
    // 1️⃣ SUPER ADMIN ROLE
    let superAdmin = await this.roleRepo.findOne({
      where: { name: 'SUPER_ADMIN' },
    });

    if (!superAdmin) {
      superAdmin = await this.roleRepo.save({
        name: 'SUPER_ADMIN',
        isSuperAdmin: true, // 👈 Important for full permissions
      });
    }

    // 2️⃣ ADMIN USERS
    const admins = [
      { name: 'Sakib', email: 'admin1@mail.com', password: 'password123' },
      { name: 'Sakib', email: 'admin2@mail.com', password: 'password123' },
    ];

    for (const admin of admins) {
      let user = await this.userRepo.findOne({
        where: { email: admin.email },
      });

      if (!user) {
        // ✅ Hash password before saving
        const hashedPassword = await bcrypt.hash(admin.password, 10);
        user = await this.userRepo.save({
          name: admin.name,
          email: admin.email,
          password: hashedPassword,
        });
      }

      // 3️⃣ Assign SUPER_ADMIN role if not already assigned
      const exists = await this.userRoleRepo.findOne({
        where: {
          userId: user.id,
          roleId: superAdmin.id, // use roleId FK
        },
      });

      if (!exists) {
        await this.userRoleRepo.save({
          userId: user.id,
          roleId: superAdmin.id,
        });
      }
    }

    console.log('✅ Super admins seeded with hashed passwords');
  }
}
