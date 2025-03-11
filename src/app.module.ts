import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UsersModule } from '@modules/users.module';
import { GymsModule } from '@modules/gyms.module';
import { AttendancesModule } from './modules/attendance.module';
import { AuditLogModule } from '@modules/audit-log.module';
import { ReportModule } from '@modules/report.module';
import { AuthModule } from 'auth/auth.module';

import { User } from './entities/user.entity';
import { Gym } from './entities/gym.entity';
import { Attendance } from './entities/attendance.entity';
import { AuditLog } from '@entities/audit-log.entity';
import { Report } from '@entities/report.entity';


@Module({
  imports: [
    // Load environment variables globally
    ConfigModule.forRoot({
     isGlobal: true ,
     envFilePath: '.env',
    }),


    // Configure TypeORM with ConfigModule
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST', 'localhost'),
        port: configService.get<number>('DATABASE_PORT', 5432),
        username: configService.get<string>('DATABASE_USER', 'postgres'),
        password: configService.get<string>('DATABASE_PASSWORD', 'amahoro'),
        database: configService.get<string>('DATABASE_NAME', 'gym_management'),
        entities: [User, Attendance, Gym, AuditLog, Report],
        synchronize: true, // Auto-create tables in development (disable in production)
      }),
    }),

    // Feature modules
    UsersModule,
    GymsModule,
    AttendancesModule,
    AuditLogModule,
    ReportModule,
    AuthModule,
  ],
})
export class AppModule {}
