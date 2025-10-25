import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateMedicineDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  nameBn?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  brand?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  brandBn?: string;

  @IsString()
  @IsNotEmpty()
  details: string;

  @IsString()
  @IsOptional()
  detailsBn?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  origin?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  originBn?: string;

  @IsString()
  @IsOptional()
  sideEffects?: string;

  @IsString()
  @IsOptional()
  sideEffectsBn?: string;

  @IsString()
  @IsOptional()
  usage?: string;

  @IsString()
  @IsOptional()
  usageBn?: string;

  @IsString()
  @IsOptional()
  howToUse?: string;

  @IsString()
  @IsOptional()
  howToUseBn?: string;
}
