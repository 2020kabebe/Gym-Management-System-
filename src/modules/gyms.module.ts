// src/modules/gyms/gyms.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gym } from '.././entities/gym.entity';
import { GymsController } from 'controllers/gyms.controller';
import { GymsService } from 'services/gyms.service';
import { AuthModule } from 'auth/auth.module';

@Module({
  imports: [
  TypeOrmModule.forFeature([Gym]),
  AuthModule,
],
  controllers: [GymsController],
  providers: [GymsService],
  exports: [GymsService],
})
export class GymsModule {}