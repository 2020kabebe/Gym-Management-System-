import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';
import { CreateAuditLogDto, FilterAuditLogDto } from '@dtos/audit-log.dto';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async createAuditLog(createAuditLogDto: CreateAuditLogDto): Promise<AuditLog> {
    const newLog = this.auditLogRepository.create(createAuditLogDto);
    return await this.auditLogRepository.save(newLog);
  }

  async getAllAuditLogs(filterDto: FilterAuditLogDto): Promise<AuditLog[]> {
    const query = this.auditLogRepository.createQueryBuilder('auditLog');

    if (filterDto.action) {
      query.andWhere('auditLog.action = :action', { action: filterDto.action });
    }
    if (filterDto.entityName) {
      query.andWhere('auditLog.entityName = :entityName', { entityName: filterDto.entityName });
    }
    if (filterDto.userId) {
      query.andWhere('auditLog.userId = :userId', { userId: filterDto.userId });
    }

    return await query.getMany();
  }

  async getAuditLogById(id: string): Promise<AuditLog> {
    const log = await this.auditLogRepository.findOne({ where: { id } });
    if (!log) {
      throw new NotFoundException(`Audit Log with ID ${id} not found`);
    }
    return log;
  }

  async deleteAuditLog(id: string): Promise<void> {
    await this.getAuditLogById(id); // Ensure the log exists
    await this.auditLogRepository.delete(id);
  }
}
