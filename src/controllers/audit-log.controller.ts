import { Controller, Post, Get, Delete, Body, Param, Query } from '@nestjs/common';
import { AuditLogService } from '../services/audit-log.service';
import { FilterAuditLogDto } from '@dtos/audit-log.dto';
import { CreateAuditLogDto } from '@dtos/audit-log.dto';

@Controller('audit-logs')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Post()
  async createAuditLog(@Body() createAuditLogDto: CreateAuditLogDto) {
    return this.auditLogService.createAuditLog(createAuditLogDto);
  }

  @Get()
  async getAllAuditLogs(@Query() filterDto: FilterAuditLogDto) {
    return this.auditLogService.getAllAuditLogs(filterDto);
  }

  @Get(':id')
  async getAuditLogById(@Param('id') id: string) {
    return this.auditLogService.getAuditLogById(id);
  }

  @Delete(':id')
  async deleteAuditLog(@Param('id') id: string) {
    await this.auditLogService.deleteAuditLog(id);
    return { message: `Audit Log with ID ${id} deleted successfully` };
  }
}
