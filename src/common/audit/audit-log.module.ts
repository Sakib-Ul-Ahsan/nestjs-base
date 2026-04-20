import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogEntity } from './audit-log.entity';
import { AuditLogService } from './audit-log.service';
import { SystemLogService } from './system-audit/system-log.service';
import { SystemLogEntity } from './system-audit/system-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLogEntity, SystemLogEntity])],
  providers: [AuditLogService, SystemLogService],
  exports: [AuditLogService],
})
export class AuditLogModule {}
