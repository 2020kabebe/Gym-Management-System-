// src/modules/users/users.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@entities/user.entity';
import { UsersService } from '../services/users.service';  // Update this path
import { UsersController } from '../controllers/users.controller';  // Update this path
import { AuthModule } from 'auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}