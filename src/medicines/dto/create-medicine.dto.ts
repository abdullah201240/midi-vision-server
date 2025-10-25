import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateMedicineDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  brand?: string;

  @IsString()
  @IsNotEmpty()
  details: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  origin?: string;

  @IsString()
  @IsOptional()
  sideEffects?: string;

  @IsString()
  @IsOptional()
  usage?: string;

  @IsString()
  @IsOptional()
  howToUse?: string;
}
