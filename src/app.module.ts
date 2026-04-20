import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './common/config/database.config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { RolePermissionModule } from './modules/role-permission/role-permission.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { UserRoleEntity } from './modules/role-permission/entities/user-role.entity';
import { PermissionsGuard } from './modules/auth/guards/permission.guard';
import { PermissionSeeder } from './database/seeders/permission.seeder';
import { RoleSeeder } from './database/seeders/role.seeder';
import { AuditLogModule } from './common/audit/audit-log.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([UserRoleEntity]), // ← for PermissionsGuard at root level
    UsersModule,
    AuthModule,
    RolePermissionModule,
    AuditLogModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // ← runs first
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard, // ← runs second, after JWT sets request.user
    },
    PermissionsGuard,
    PermissionSeeder,
    RoleSeeder,
  ],
  exports: [PermissionSeeder, RoleSeeder],
})
export class AppModule {}
