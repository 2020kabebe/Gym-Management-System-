import { Controller, Post, Get, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { ReportService } from '../services/report.service';
import { FilterReportDto } from '@dtos/report.dto';
import { CreateReportDto,} from '@dtos/report.dto';
import { UpdateReportDto } from '@dtos/report.dto';


@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  async createReport(@Body() createReportDto: CreateReportDto) {
    return this.reportService.createReport(createReportDto);
  }

  @Get()
  async getAllReports(@Query() filterDto: FilterReportDto) {
    return this.reportService.getAllReports(filterDto);
  }

  @Get(':id')
  async getReportById(@Param('id') id: string) {
    return this.reportService.getReportById(id);
  }

  @Patch(':id')
  async updateReport(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
    return this.reportService.updateReport(id, updateReportDto);
  }

  @Delete(':id')
  async deleteReport(@Param('id') id: string) {
    await this.reportService.deleteReport(id);
    return { message: `Report with ID ${id} deleted successfully` };
  }
}
