import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  NotFoundException,
  UseInterceptors,
  ClassSerializerInterceptor,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserResponseDto } from './dto/user-response.dto';
import { userImageMulterConfig } from './config/multer.config';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req): Promise<UserResponseDto> {
    return new UserResponseDto(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<UserResponseDto> {
    // Ensure user can only update their own profile
    const user = await this.usersService.update(req.user.id, updateProfileDto);
    return new UserResponseDto(user);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile/image')
  @UseInterceptors(FileInterceptor('image', userImageMulterConfig))
  async updateProfileImage(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UserResponseDto> {
    const imageName = file?.filename;
    const updateProfileDto = new UpdateProfileDto();
    const user = await this.usersService.update(req.user.id, updateProfileDto, imageName);
    return new UserResponseDto(user);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile/cover')
  @UseInterceptors(FileInterceptor('coverPhoto', userImageMulterConfig))
  async updateProfileCover(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UserResponseDto> {
    const coverPhotoName = file?.filename;
    const updateProfileDto = new UpdateProfileDto();
    updateProfileDto.coverPhoto = coverPhotoName;
    const user = await this.usersService.update(req.user.id, updateProfileDto, undefined, coverPhotoName);
    return new UserResponseDto(user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('profile/cover')
  async removeProfileCover(@Request() req): Promise<UserResponseDto> {
    // Create an update DTO to set cover photo to null
    const updateProfileDto = new UpdateProfileDto();
    updateProfileDto.coverPhoto = null;

    // Update the user to delete the cover photo
    const updatedUser = await this.usersService.update(req.user.id, updateProfileDto);

    return new UserResponseDto(updatedUser);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('profile/image')
  async removeProfileImage(@Request() req): Promise<UserResponseDto> {
    // Create an update DTO to set image to null
    const updateProfileDto = new UpdateProfileDto();
    updateProfileDto.image = null;

    // Update the user to delete the image
    const updatedUser = await this.usersService.update(req.user.id, updateProfileDto);

    return new UserResponseDto(updatedUser);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
    @Query('role') role?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const sortField = sortBy || 'createdAt';
    const sortDirection = sortOrder || 'DESC';

    return this.usersService.findAll({
      page: pageNum,
      limit: limitNum,
      search,
      sortBy: sortField,
      sortOrder: sortDirection,
      role,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return new UserResponseDto(user);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UseInterceptors(FileInterceptor('image', userImageMulterConfig))
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UserResponseDto> {
    const imageName = file?.filename;
    return this.usersService.update(id, updateUserDto, imageName);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.usersService.remove(id);
    return { message: 'User deleted successfully' };
  }
}