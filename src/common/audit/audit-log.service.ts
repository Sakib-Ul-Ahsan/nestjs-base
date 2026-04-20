import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuditLogEntity } from './audit-log.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLogEntity)
    private repo: Repository<AuditLogEntity>,
  ) {}

  async log(data: Partial<AuditLogEntity>) {
    // 🔥 DO NOT await in interceptor → fire and forget
    this.repo.save(data).catch((err) => {
      console.error('Audit log failed:', err);
    });
  }
}