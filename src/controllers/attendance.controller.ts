// src/modules/attendances/attendances.controller.ts
import { Body, Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '.././guards/jwt-auth.guard';
import { RolesGuard } from '.././guards/roles.guard';
import { Roles } from '.././decorators/roles.decorator';
import { UserRole } from '.././entities/user.entity';
import { CreateAttendanceDto, ConfirmAttendanceDto } from '.././dtos/attendance.dto';
import { Attendance } from '@entities/attendance.entity';
import { AttendancesService } from 'services/attendance.service';



@Controller('attendances')
@UseGuards(JwtAuthGuard)
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.attendancesService.findAll();
  }

  @Get('gym/:gymId/date/:date')
  @UseGuards(RolesGuard)
  @Roles(UserRole.GYM_STAFF, UserRole.ADMIN)
  findByGymAndDate(
    @Param('gymId') gymId: string,
    @Param('date') dateString: string,
  ) {
    const date = new Date(dateString);
    return this.attendancesService.findByGymAndDate(gymId, date);
  }

  @Get('user/:userId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN)
  findByUser(@Param('userId') userId: string) {
    return this.attendancesService.findByUser(userId);
  }
  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.EMPLOYEE)
    async createAttendance(
      @Body() createAttendanceDto: CreateAttendanceDto,
      @Request() req,
    ) {
      return this.attendancesService.createAttendance(req.user.id, createAttendanceDto);
    }

    @Get('report')
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
     async generateReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('gymId') gymId?: string,
) {
  return this.attendancesService.generateReport(new Date(startDate), new Date(endDate), gymId);
}

@Get('history')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN, UserRole.GYM_STAFF, UserRole.EMPLOYEE)
async getAttendanceHistory(
  @Query('startDate') startDate: string,
  @Query('endDate') endDate: string,
  @Query('gymId') gymId?: string,
) {
  return this.attendancesService.fetchAttendanceHistory(new Date(startDate), new Date(endDate), gymId);
}
@Get('recent')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN, UserRole.GYM_STAFF, UserRole.EMPLOYEE)
async getRecentAttendance() {
  // Implement logic to fetch recent attendance records
  return this.attendancesService.getRecentAttendance();
}

@Post('confirm')
@UseGuards(RolesGuard)
@Roles(UserRole.GYM_STAFF)
async confirmAttendance(
  @Body() confirmAttendanceDto: ConfirmAttendanceDto,
  @Request() req,
) {
  return this.attendancesService.confirm(req.user.id, confirmAttendanceDto);
}
}