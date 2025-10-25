import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { unlink } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(
    registerDto: RegisterDto,
    imageName?: string,
  ): Promise<UserResponseDto> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const user = this.usersRepository.create({
      ...registerDto,
      image: imageName || undefined,
    });
    const savedUser = await this.usersRepository.save(user);
    return new UserResponseDto(savedUser);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersRepository.find();
    return users.map((user) => new UserResponseDto(user));
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { id } });
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { email } });
    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    newImage?: string,
  ): Promise<UserResponseDto> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.findByEmail(updateUserDto.email);
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }

    // Delete old image if new image is uploaded
    if (newImage && user.image) {
      try {
        await unlink(join(process.cwd(), 'uploads', 'users', user.image));
      } catch (error) {
        console.error(`Failed to delete old image ${user.image}:`, error);
      }
    }

    Object.assign(user, updateUserDto);
    if (newImage) {
      user.image = newImage;
    }

    const updatedUser = await this.usersRepository.save(user);
    return new UserResponseDto(updatedUser);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Delete user image if exists
    if (user.image) {
      try {
        await unlink(join(process.cwd(), 'uploads', 'users', user.image));
      } catch (error) {
        console.error(`Failed to delete image ${user.image}:`, error);
      }
    }

    await this.usersRepository.remove(user);
  }
}
