import { IsString, IsOptional, IsBoolean,  IsEmail, IsNumberString } from 'class-validator';
import { IsNumber } from 'class-validator';



export class UpdateGymDto {
    @IsOptional()
    @IsString()
    Gym_name?: string;
  
    @IsOptional()
    @IsString()
    Location?: string;
  
    @IsOptional()
    @IsNumber() // ✅ Change from IsNumberString() to IsNumber()
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
  