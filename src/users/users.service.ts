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
import { PaginatedUserResponseDto } from './dto/paginated-user-response.dto';
import { unlink } from 'fs/promises';
import { join } from 'path';

export interface FindAllUsersOptions {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  role?: string;
}

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

  async findAll(
    options?: FindAllUsersOptions,
  ): Promise<PaginatedUserResponseDto | UserResponseDto[]> {
    // If no options provided, return all users (backward compatibility)
    if (!options) {
      const users = await this.usersRepository.find();
      return users.map((user) => new UserResponseDto(user));
    }

    const {
      page,
      limit,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      role,
    } = options;

    // Build query
    const queryBuilder = this.usersRepository.createQueryBuilder('user');

    // Apply search filter
    if (search) {
      queryBuilder.where(
        '(user.name ILIKE :search OR user.email ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Apply role filter
    if (role && (role === 'admin' || role === 'user')) {
      if (search) {
        queryBuilder.andWhere('user.role = :role', { role });
      } else {
        queryBuilder.where('user.role = :role', { role });
      }
    }

    // Apply sorting
    const validSortFields = ['name', 'email', 'role', 'createdAt'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    queryBuilder.orderBy(`user.${sortField}`, sortOrder);

    // Get total count
    const total = await queryBuilder.getCount();

    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Execute query
    const users = await queryBuilder.getMany();

    const data = users.map((user) => new UserResponseDto(user));
    return new PaginatedUserResponseDto(data, total, page, limit);
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
    newCoverPhoto?: string,
    deleteImage: boolean = false,
    deleteCoverPhoto: boolean = false,
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

    // Delete old image if new image is uploaded or if explicitly requested
    if (
      (newImage && user.image) ||
      (deleteImage && user.image) ||
      (updateUserDto.image === null && user.image)
    ) {
      try {
        await unlink(join(process.cwd(), 'uploads', 'users', user.image));
      } catch (error) {
        console.error(`Failed to delete old image ${user.image}:`, error);
      }
    }

    // Delete old cover photo if new cover photo is uploaded or if explicitly requested
    if (
      (newCoverPhoto && user.coverPhoto) ||
      (deleteCoverPhoto && user.coverPhoto) ||
      (updateUserDto.coverPhoto === null && user.coverPhoto)
    ) {
      try {
        await unlink(join(process.cwd(), 'uploads', 'users', user.coverPhoto));
      } catch (error) {
        console.error(
          `Failed to delete old cover photo ${user.coverPhoto}:`,
          error,
        );
      }
    }

    Object.assign(user, updateUserDto);
    if (newImage !== undefined) {
      user.image = newImage;
    } else if (updateUserDto.image === null) {
      user.image = null;
    }

    if (newCoverPhoto !== undefined) {
      user.coverPhoto = newCoverPhoto;
    } else if (updateUserDto.coverPhoto === null) {
      user.coverPhoto = null;
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
