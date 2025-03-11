// src/modules/attendances/attendances.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { CreateAttendanceDto, ConfirmAttendanceDto } from '@dtos/attendance.dto';
import { Attendance } from '@entities/attendance.entity';
import { Gym } from '@entities/gym.entity';
import { User, UserRole } from '@entities/user.entity';

@Injectable()
export class AttendancesService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Gym)
    private gymRepository: Repository<Gym>,
  ) {}

  async findAll(): Promise<Attendance[]> {
    return this.attendanceRepository.find({
      relations: ['user', 'gym'],
    });
  }

  async findByGymAndDate(gymId: string, date: Date): Promise<Attendance[]> {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    
    return this.attendanceRepository.find({
      where: {
        gymId,
        checkInTime: Between(startDate, endDate),
      },
      relations: ['user'],
    });
  }

  async findByUser(userId: string): Promise<Attendance[]> {
    return this.attendanceRepository.find({
      where: { userId },
      relations: ['gym'],
      order: { checkInTime: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Attendance> {
    const attendance = await this.attendanceRepository.findOne({
      where: { id },
      relations: ['user', 'gym'],
    });
    
    if (!attendance) {
      throw new NotFoundException(`Attendance record with ID ${id} not found`);
    }
    
    return attendance;
  }

  async create(userId: string, createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    
    const gym = await this.gymRepository.findOne({
      where: { id: createAttendanceDto.gymId, isActive: true },
    });
    
    if (!gym) {
      throw new NotFoundException(`Gym with ID ${createAttendanceDto.gymId} not found or inactive`);
    }
    
    const checkInTime = createAttendanceDto.checkInTime || new Date();
    
    const newAttendance = this.attendanceRepository.create({
      userId,
      gymId: createAttendanceDto.gymId,
      checkInTime,
    });
    
    return this.attendanceRepository.save(newAttendance);
  }
//confirm the attendance
  async confirm(gymStaffId: string, confirmDto: ConfirmAttendanceDto): Promise<Attendance> {
    const attendance = await this.findOne(confirmDto.attendanceId);
    
    if (attendance.isConfirmed) {
      throw new BadRequestException('Attendance already confirmed');
    }
    
    const gymStaff = await this.userRepository.findOne({
      where: { id: gymStaffId, role: UserRole.GYM_STAFF },
    });
    
    if (!gymStaff) {
      throw new BadRequestException('Only gym staff can confirm attendance');
    }
    
    attendance.confirmedBy = gymStaffId;
    attendance.confirmationTime = confirmDto.confirmationTime || new Date();
    attendance.isConfirmed = true;
    
    return this.attendanceRepository.save(attendance);
  }
//generate reports
  async generateReport(startDate: Date, endDate: Date, gymId?: string): Promise<any> {
    const whereCondition: any = {
      checkInTime: Between(startDate, endDate),
    };
    
    if (gymId) {
      whereCondition.gymId = gymId;
    }
    
    const attendances = await this.attendanceRepository.find({
      where: whereCondition,
      relations: ['user', 'gym'],
    });
    
    // Total attendance
    const totalAttendance = attendances.length;
    
  
    
    // Attendance trends (by day)
    const trendsByDay = {};
    attendances.forEach(attendance => {
      const day = attendance.checkInTime.toISOString().split('T')[0];
      if (!trendsByDay[day]) {
        trendsByDay[day] = 0;
      }
      trendsByDay[day]++;
    });
    
    return {
      totalAttendance,
      trendsByDay,
      details: attendances,
    };
  }
//create attendance
  async createAttendance(userId: string, createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {
    // Check if the user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  
    // Check if the gym exists and is active
    const gym = await this.gymRepository.findOne({
      where: { id: createAttendanceDto.gymId, isActive: true },
    });
    if (!gym) {
      throw new NotFoundException(`Gym with ID ${createAttendanceDto.gymId} not found or inactive`);
    }
  
    // Create new attendance record
    const attendance = this.attendanceRepository.create({
      userId,  // Now passed as an argument, not from DTO
      gymId: createAttendanceDto.gymId,
      checkInTime: createAttendanceDto.checkInTime || new Date(),
    });
  
    // Save to database
    return this.attendanceRepository.save(attendance);
  }
  async fetchAttendanceHistory(startDate: Date, endDate: Date, gymId?: string): Promise<Attendance[]> {
    const whereCondition: any = {
      checkInTime: Between(startDate, endDate),
    };
    
    if (gymId) {
      whereCondition.gymId = gymId;
    }
    
    return this.attendanceRepository.find({
      where: whereCondition,
      relations: ['user', 'gym'],
    });
  }
  async getRecentAttendance(): Promise<Attendance[]> {
    // Fetch recent attendance records, e.g., the last 7 days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
  
    const endDate = new Date();
  
    return this.attendanceRepository.find({
      where: {
        checkInTime: Between(startDate, endDate),
      },
      relations: ['user', 'gym'],
    });
  }
}