import { Exclude } from 'class-transformer';

export class MedicineResponseDto {
  id: string;
  name: string;
  nameBn?: string;
  brand?: string;
  brandBn?: string;
  details: string;
  detailsBn?: string;
  origin?: string;
  originBn?: string;
  sideEffects?: string;
  sideEffectsBn?: string;
  usage?: string;
  usageBn?: string;
  howToUse?: string;
  howToUseBn?: string;
  images?: string[];

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<MedicineResponseDto>) {
    Object.assign(this, partial);
  }
}
