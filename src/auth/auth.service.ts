// src/modules/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User, UserRole } from '@entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'services/users.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async register(
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    role: UserRole
  ) {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ 
      where: { email } 
    });
    
    if (existingUser) {
      throw new UnauthorizedException('User with this email already exists');
    }

    const hashedPassword = await this.hashPassword(password);
    
    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
      isActive: true,
    });

    const savedUser = await this.userRepository.save(newUser);
    const { password: _, ...result } = savedUser;
    return result;
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email, isActive: true },
      select: ['id', 'email', 'password', 'firstName', 'lastName', 'role', 'isActive'],
    });

    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
  
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role 
    };
  
    const secret = this.configService.get<string>('JWT_SECRET'); // Load secret from .env
  
    if (!secret) {
      throw new Error('JWT_SECRET is not defined. Check your .env file.');
    }
  
    return {
      accessToken: this.jwtService.sign(payload, { secret }), // Explicitly pass the secret
      user,
    };
  }
   // Admin login logic
   async loginAdmin(email: string, password: string) {
    const user = await this.validateUser(email, password);

    if (!user || user.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Invalid admin credentials or insufficient permissions');
    }

    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role 
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }
 
   // Employee login logic
   async loginEmployee(email: string, password: string) {
    const user = await this.validateUser(email, password);

    if (!user || user.role !== UserRole.EMPLOYEE) {
      throw new UnauthorizedException('Invalid employee credentials or insufficient permissions');
    }

    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role 
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }
  // Gym Staff login logic
  async loginGymStaff(email: string, password: string) {
    const user = await this.validateUser(email, password);

    if (!user || user.role !== UserRole.GYM_STAFF) {
      throw new UnauthorizedException('Invalid gym staff credentials or insufficient permissions');
    }

    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role 
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }
}