// src/modules/users/users.controller.ts
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, Request, BadRequestException} from '@nestjs/common';
import { JwtAuthGuard } from 'guards/jwt-auth.guard';
import { RolesGuard } from 'guards/roles.guard';
import { Roles } from 'decorators/roles.decorator';
import { UserRole } from '@entities/user.entity';
import { CreateUserDto, UpdateUserDto } from '@dtos/user.dto';
import { UsersService } from 'services/users.service';
import { ResetPasswordDto } from '@dtos/reset-password.dto';


@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
  @Patch('reset-password')
@Roles(UserRole.ADMIN)  // Make sure only admins can access this endpoint
async resetPassword(
  @Request() req,
  @Body() resetPasswordDto: ResetPasswordDto
) {
  return this.usersService.resetPassword(
    req.user.id,  // Get the admin's ID from the request
    resetPasswordDto.userId,
    resetPasswordDto.newPassword
  );
}
@Delete(':id')
@Roles(UserRole.ADMIN)
async remove(@Param('id') id: string): Promise<void> {
  if (!id) {
    throw new BadRequestException('User ID is required');
  }
  await this.usersService.remove(id);

}

  } 
