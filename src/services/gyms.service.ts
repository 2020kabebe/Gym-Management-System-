// src/modules/gyms/gyms.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGymDto, UpdateGymDto } from '@dtos/gym.dto';
import { Gym } from '@entities/gym.entity';

@Injectable()
export class GymsService {
  constructor(
    @InjectRepository(Gym)
    private gymRepository: Repository<Gym>,
  ) {}

  // Fetch all active gyms
  async findAll(): Promise<Gym[]> {
    return this.gymRepository.find({ where: { isActive: true } });
  }

  // Find a gym by ID
  async findOne(id: string): Promise<Gym> {
    const gym = await this.gymRepository.findOne({ where: { id } });

    if (!gym) {
      throw new NotFoundException(`Gym with ID ${id} not found`);
    }

    return gym;
  }

  // Create a new gym
  async create(createGymDto: CreateGymDto): Promise<Gym> {
    // Ensure membership_fees is a number
    if (typeof createGymDto.membership_fees !== 'number') {
      throw new BadRequestException('membership_fees must be a number');
    }

    const newGym = this.gymRepository.create(createGymDto);
    return this.gymRepository.save(newGym);
  }

  // Update a gym's details
  async update(id: string, updateGymDto: UpdateGymDto): Promise<Gym> {
    const gym = await this.findOne(id);

    // Validate membership_fees if provided
    if (
      updateGymDto.membership_fees !== undefined &&
      typeof updateGymDto.membership_fees !== 'number'
    ) {
      throw new BadRequestException('membership_fees must be a number');
    }

    Object.assign(gym, updateGymDto); // Update only provided fields
    return this.gymRepository.save(gym);
  }

  // Soft delete a gym (deactivate instead of removing)
  async remove(id: string): Promise<Gym> {
    const gym = await this.findOne(id);
    gym.isActive = false; // Instead of deleting, mark it inactive
    return this.gymRepository.save(gym);
  }

  // Explicitly deactivate a gym
  async deactivate(id: string): Promise<Gym> {
    return this.remove(id); // Calls the same logic as remove()
  }
}
