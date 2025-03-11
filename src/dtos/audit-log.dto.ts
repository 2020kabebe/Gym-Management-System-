import { IsString, IsEnum, IsOptional,IsObject } from 'class-validator';
import { ActionType } from '../entities/audit-log.entity';

export class CreateAuditLogDto {
  @IsEnum(ActionType)
  action: ActionType;

  @IsString()
  entityName: string;

  @IsOptional()
  @IsString()
  entityId?: string;

  @IsOptional()
  @IsObject()
  oldValues?: Record<string, any>;

  @IsOptional()
  @IsObject()
  newValues?: Record<string, any>;

  @IsOptional()
  userId?: string;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;
}

export class FilterAuditLogDto {
  @IsOptional()
  @IsEnum(ActionType)
  action?: ActionType;

  @IsOptional()
  @IsString()
  entityName?: string;

  @IsOptional()
  userId?: string;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;
}
