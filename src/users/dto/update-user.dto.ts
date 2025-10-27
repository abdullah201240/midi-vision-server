import {
  IsEmail,
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  MinLength,
  Matches,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{10,20}$/, {
    message: 'Phone must be between 10 and 20 digits',
  })
  phone?: string;

  @IsOptional()
  @IsEnum(['male', 'female', 'other'])
  gender?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  image?: string | null;

  @IsOptional()
  @IsString()
  coverPhoto?: string | null;

  @IsOptional()
  @IsString()
  @MinLength(2)
  location?: string;

  @IsOptional()
  @IsString()
  bio?: string;
}