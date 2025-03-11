// src/modules/attendances/attendances.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from '@entities/attendance.entity';
import { Gym } from '@entities/gym.entity';
import { User } from '@entities/user.entity';
import { AttendancesController } from 'controllers/attendance.controller';
import { AttendancesService } from 'services/attendance.service';

@Module({
  imports: [TypeOrmModule.forFeature([Attendance, User, Gym])],
  controllers: [AttendancesController],
  providers: [AttendancesService],
})
export class AttendancesModule {}