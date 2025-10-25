import { Exclude } from 'class-transformer';

export class UserResponseDto {
  id: string;
  name: string;
  email: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: Date;
  image?: string;
  createdAt: Date;
  updatedAt: Date;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
