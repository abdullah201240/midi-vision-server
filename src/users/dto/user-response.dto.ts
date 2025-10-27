import { Exclude, Expose } from 'class-transformer';

export class UserResponseDto {
  id: string;
  name: string;
  email: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: Date;
  image?: string | null;
  coverPhoto?: string | null;
  role: string;
  location?: string;
  bio?: string;

  @Expose()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}