import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from '../entities/report.entity';
import { CreateReportDto, UpdateReportDto, FilterReportDto } from '@dtos/report.dto';


@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) {}

  async createReport(createReportDto: CreateReportDto): Promise<Report> {
    const newReport = this.reportRepository.create(createReportDto);
    return await this.reportRepository.save(newReport);
  }

  async getAllReports(filterDto: FilterReportDto): Promise<Report[]> {
    const query = this.reportRepository.createQueryBuilder('report');

    if (filterDto.type) {
      query.andWhere('report.type = :type', { type: filterDto.type });
    }
    if (filterDto.format) {
      query.andWhere('report.format = :format', { format: filterDto.format });
    }
    if (filterDto.generatedById) {
      query.andWhere('report.generatedById = :generatedById', { generatedById: filterDto.generatedById });
    }

    return await query.getMany();
  }

  async getReportById(id: string): Promise<Report> {
    const report = await this.reportRepository.findOne({ where: { id } });
    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }
    return report;
  }

  async updateReport(id: string, updateReportDto: UpdateReportDto): Promise<Report> {
    await this.getReportById(id); // Ensure the report exists
    await this.reportRepository.update(id, updateReportDto);
    return this.getReportById(id);
  }

  async deleteReport(id: string): Promise<void> {
    await this.getReportById(id); // Ensure the report exists
    await this.reportRepository.delete(id);
  }
}
