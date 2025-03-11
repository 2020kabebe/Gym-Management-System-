import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from '../entities/report.entity';
import { ReportService } from '../services/report.service';
import { ReportController } from '../controllers/report.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Report])],
  controllers: [ReportController],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {}
