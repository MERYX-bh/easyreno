import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsEnum(['company', 'owner'])
  userType: 'company' | 'owner';

  @IsString()
  name: string;

  
}