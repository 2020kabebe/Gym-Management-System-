import { 
    IsString, 
    IsEnum, 
    IsOptional, 
    //UUID, 
    IsObject, 
    IsBoolean 
  } from 'class-validator';
  import { ReportType, ReportFormat } from '../entities/report.entity';
  
  export class CreateReportDto {
    @IsString()
    name: string;
  
    @IsEnum(ReportType)
    type: ReportType;
  
    @IsObject()
    parameters: Record<string, any>;
  
    @IsOptional()
    @IsObject()
    data?: Record<string, any>;
  
    @IsEnum(ReportFormat)
    format: ReportFormat;
  
    @IsOptional()
    @IsString()
    filePath?: string;
  
   //IsUUID()
    generatedById: string;
  
    @IsOptional()
    @IsBoolean()
    isScheduled?: boolean;
  
    @IsOptional()
    @IsString()
    scheduleExpression?: string;
  }
  
  export class UpdateReportDto {
    @IsOptional()
    @IsString()
    name?: string;
  
    @IsOptional()
    @IsEnum(ReportType)
    type?: ReportType;
  
    @IsOptional()
    @IsObject()
    parameters?: Record<string, any>;
  
    @IsOptional()
    @IsObject()
    data?: Record<string, any>;
  
    @IsOptional()
    @IsEnum(ReportFormat)
    format?: ReportFormat;
  
    @IsOptional()
    @IsString()
    filePath?: string;
  
    @IsOptional()
    @IsBoolean()
    isScheduled?: boolean;
  
    @IsOptional()
    @IsString()
    scheduleExpression?: string;
  }
  
  export class FilterReportDto {
    @IsOptional()
    @IsEnum(ReportType)
    type?: ReportType;
  
    @IsOptional()
    @IsEnum(ReportFormat)
    format?: ReportFormat;
  
    @IsOptional()
   //IsUUID()
    generatedById?: string;
  }
  