import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
