// src/dtos/attendance.dto.ts
import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAttendanceDto {

  @IsNotEmpty()
  gymId: string;

  @IsDateString()
  @IsOptional()
  checkInTime?: Date;
}

export class ConfirmAttendanceDto {
  @IsNotEmpty()
  attendanceId: string;

  @IsDateString()
  @IsOptional()
  confirmationTime?: Date;
}
