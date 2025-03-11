// src/modules/gyms/gyms.controller.ts
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards,Put } from '@nestjs/common';
import { JwtAuthGuard } from 'guards/jwt-auth.guard';
import { RolesGuard } from 'guards/roles.guard';
import { Roles } from '.././decorators/roles.decorator';
import { UserRole } from '@entities/user.entity';
import { CreateGymDto, UpdateGymDto } from '.././dtos/gym.dto';
import { GymsService} from 'services/gyms.service';

@Controller('gyms')
@UseGuards(JwtAuthGuard)
export class GymsController {
  constructor(private readonly gymsService: GymsService) {}

  @Get()
  findAll() {
    return this.gymsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gymsService.findOne(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createGymDto: CreateGymDto) {
    return this.gymsService.create(createGymDto);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateGymDto: UpdateGymDto) {
    return this.gymsService.update(id, updateGymDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.gymsService.remove(id);
  }

  @Patch(':id/deactivate')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  deactivate(@Param('id') id: string) {
    return this.gymsService.deactivate(id);
  }
}