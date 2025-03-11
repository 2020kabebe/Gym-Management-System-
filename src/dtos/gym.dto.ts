import { IsString, IsOptional, IsBoolean,  IsEmail, IsNumberString } from 'class-validator';
import { IsNumber } from 'class-validator';
import { IsNotEmpty } from 'class-validator';
export class CreateGymDto {
  @IsString()
  Gym_name: string;

  @IsString()
  Location: string;
 
  @IsNotEmpty()
  @IsNumber()
  membership_fees: number;

  @IsOptional()
  @IsString()
  facilities?: string;

  @IsString()
  Opening_Hours: string;

  @IsOptional()
  @IsString()
  Phone_number?: string;

  @IsOptional()
  @IsEmail()
  Email?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateGymDto {
  @IsOptional()
  @IsString()
  Gym_name?: string;

  @IsOptional()
  @IsString()
  Location?: string;

  @IsOptional()
  @IsNumber()
  membership_fees?: number;

  @IsOptional()
  @IsString()
  facilities?: string;

  @IsOptional()
  @IsString()
  Opening_Hours?: string;

  @IsOptional()
  @IsString()
  Phone_number?: string;

  @IsOptional()
  @IsEmail()
  Email?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
