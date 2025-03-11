// src/modules/users/users.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from '.././dtos/user.dto';
import { User } from '@entities/user.entity';
import { JwtStrategy } from 'auth/jwt.strategy';
import { UserRole } from '@entities/user.entity';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    return user;
  }


  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findByEmail(createUserDto.email);
    
    if (existingUser) {
      throw new BadRequestException(`User with email ${createUserDto.email} already exists`);
    }
    
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    
    return this.userRepository.save(newUser);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    
    const updatedUser = {
      ...user,
      ...updateUserDto,
    };
    
    return this.userRepository.save(updatedUser);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
  async resetPassword(adminId: string, userId: string, newPassword: string): Promise<User> {
    // Ensure the admin exists and has the right role
    const admin = await this.userRepository.findOne({ where: { id: adminId } });
    if (!admin || admin.role !== UserRole.ADMIN) {
      throw new BadRequestException('Only admins can reset passwords');
    }
  
    // Find the user whose password needs resetting
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  
    // Hash the new password
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(newPassword, salt);
  
    // Save the updated user
    return this.userRepository.save(user);
  }
  
}