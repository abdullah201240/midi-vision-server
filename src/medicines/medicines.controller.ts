import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  UploadedFiles,
  UploadedFile,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { MedicinesService } from './medicines.service';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { multerConfig } from './config/multer.config';

@Controller('medicines')
@UseInterceptors(ClassSerializerInterceptor)
export class MedicinesController {
  constructor(private readonly medicinesService: MedicinesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  @UseInterceptors(FilesInterceptor('images', 10, multerConfig))
  async create(
    @Body() createMedicineDto: CreateMedicineDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const imageNames = files?.map((file) => file.filename) || [];
    return this.medicinesService.create(createMedicineDto, imageNames);
  }

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const sortField = sortBy || 'createdAt';
    const sortDirection = sortOrder || 'DESC';

    return this.medicinesService.findAll({
      page: pageNum,
      limit: limitNum,
      search,
      sortBy: sortField,
      sortOrder: sortDirection,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.medicinesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images', 10, multerConfig))
  async update(
    @Param('id') id: string,
    @Body() updateMedicineDto: UpdateMedicineDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const imageNames = files?.map((file) => file.filename) || [];
    return this.medicinesService.update(id, updateMedicineDto, imageNames);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.medicinesService.remove(id);
    return { message: 'Medicine deleted successfully' };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id/images/:imageName')
  async removeImage(
    @Param('id') id: string,
    @Param('imageName') imageName: string,
  ) {
    return this.medicinesService.removeImage(id, imageName);
  }

  @UseGuards(JwtAuthGuard)
  @Post('search-by-image')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async searchByImage(
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No image file provided');
    }
    return this.medicinesService.searchByImage(file.filename);
  }
}
