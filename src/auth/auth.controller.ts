// src/modules/auth/auth.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRole } from '@entities/user.entity';
import { IsEmail, IsString, IsEnum, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEnum(UserRole)
  role: UserRole;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(
      registerDto.email,
      registerDto.password,
      registerDto.firstName,
      registerDto.lastName,
      registerDto.role
    );
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

   // Admin login route
   @Post('admin/login')
   @HttpCode(HttpStatus.OK)
   async adminLogin(@Body() loginDto: LoginDto) {
     return this.authService.loginAdmin(loginDto.email, loginDto.password);
   }
 
   // Employee login route
   @Post('employee/login')
   @HttpCode(HttpStatus.OK)
   async employeeLogin(@Body() loginDto: LoginDto) {
     return this.authService.loginEmployee(loginDto.email, loginDto.password);
   }
 
   // Gym Staff login route
   @Post('gym-staff/login')
   @HttpCode(HttpStatus.OK)
   async gymStaffLogin(@Body() loginDto: LoginDto) {
     return this.authService.loginGymStaff(loginDto.email, loginDto.password);
   }
}