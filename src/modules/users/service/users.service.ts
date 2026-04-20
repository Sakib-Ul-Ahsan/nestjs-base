import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from 'src/modules/role-permission/entities/role.entity';
import { UserRoleEntity } from 'src/modules/role-permission/entities/user-role.entity';
import { SystemLogService } from 'src/common/audit/system-audit/system-log.service';
import { CreateUserDto, UpdateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { SystemAction } from 'src/common/audit/system-audit/system-audit.enum';
import { FilterUserDto } from '../dto/filter-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,

    @InjectRepository(RoleEntity)
    private roleRepo: Repository<RoleEntity>,

    @InjectRepository(UserRoleEntity)
    private userRoleRepo: Repository<UserRoleEntity>,

    private systemLogService: SystemLogService,
  ) {}

  async findByEmail(email: string) {
    return this.userRepo.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true, // 👈 override select:false
      },
    });
  }

  async findAllUsers(query: FilterUserDto, actor: any, req: any) {
    const { email, name, isActive, page = 1, limit = 10 } = query;

    const qb = this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userRoles', 'userRoles')
      .leftJoinAndSelect('userRoles.role', 'role');

    if (email) {
      qb.andWhere('user.email ILIKE :email', { email: `%${email}%` });
    }

    if (name) {
      qb.andWhere('user.name ILIKE :name', { name: `%${name}%` });
    }

    if (isActive !== undefined) {
      qb.andWhere('user.isActive = :isActive', { isActive });
    }

    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
      },
    };
  }

  async findById(id: string) {
    return this.userRepo.findOne({
      where: { id },
      relations: ['userRoles', 'userRoles.role'], // optional if you want roles
    });
  }

  async createUser(dto: CreateUserDto, actor: any, req: any) {
    const role = await this.roleRepo.findOne({
      where: { id: dto.roleId },
    });

    if (!role) throw new NotFoundException('Role not found');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.userRepo.create({
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
    });

    const savedUser = await this.userRepo.save(user);

    await this.userRoleRepo.save({
      userId: savedUser.id,
      roleId: role.id,
    });

    this.systemLogService.log({
      action: SystemAction.USER_CREATED,
      entityType: 'USER',
      entityId: savedUser.id,
      userId: actor.id,
      targetUserId: savedUser.id,
      ip: req.ip,
      newValues: {
        email: savedUser.email,
        name: savedUser.name,
        role: role.name,
      },
    });

    this.systemLogService.log({
      action: SystemAction.USER_ROLE_ASSIGNED,
      entityType: 'USER',
      entityId: savedUser.id,
      userId: actor.id,
      targetUserId: savedUser.id,
      metadata: {
        roleId: role.id,
        roleName: role.name,
      },
    });

    return savedUser;
  }

  async updateUser(id: string, dto: UpdateUserDto, actor: any, req: any) {
    const user = await this.userRepo.findOne({ where: { id } });

    if (!user) throw new NotFoundException();

    const oldValues = {
      email: user.email,
      name: user.name,
    };

    Object.assign(user, dto);

    const updated = await this.userRepo.save(user);

    this.systemLogService.log({
      action: SystemAction.USER_UPDATED,
      entityType: 'USER',
      entityId: user.id,
      userId: actor.id,
      targetUserId: user.id,
      ip: req.ip,
      oldValues,
      newValues: {
        email: updated.email,
        name: updated.name,
      },
    });

    return updated;
  }

  async deleteUser(id: string, actor: any, req: any) {
    const user = await this.userRepo.findOne({ where: { id } });

    if (!user) throw new NotFoundException();

    await this.userRepo.delete(id);

    this.systemLogService.log({
      action: SystemAction.USER_DELETED,
      entityType: 'USER',
      entityId: id,
      userId: actor.id,
      targetUserId: id,
      ip: req.ip,
      oldValues: {
        email: user.email,
        name: user.name,
      },
    });

    return { success: true };
  }
}
