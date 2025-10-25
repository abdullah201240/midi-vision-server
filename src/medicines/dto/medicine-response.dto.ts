import { Exclude } from 'class-transformer';

export class MedicineResponseDto {
  id: string;
  name: string;
  brand?: string;
  details: string;
  origin?: string;
  sideEffects?: string;
  usage?: string;
  howToUse?: string;
  images?: string[];

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<MedicineResponseDto>) {
    Object.assign(this, partial);
  }
}
