import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SystemLogEntity } from './system-log.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SystemLogService {
  constructor(
    @InjectRepository(SystemLogEntity)
    private repo: Repository<SystemLogEntity>,
  ) {}

  async log(data: Partial<SystemLogEntity>) {
    this.repo.save(data).catch(() => {});
  }
}
