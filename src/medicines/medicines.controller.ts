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
  NotFoundException,
  Query,
  Request,
} from '@nestjs/common';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { MedicinesService } from './medicines.service';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { multerConfig } from './config/multer.config';
import { SearchResultDto } from '../users/dto/search-result.dto';

interface AuthenticatedRequest {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    [key: string]: any;
  };
}

// Extend SearchResultDto to include ML-specific fields
interface MLSearchResult extends SearchResultDto {
  matched_image?: string;
  similarity?: number;
  confidence?: string;
}

// Define interface for user history data
interface UserHistoryData {
  actionType: string;
  imageData: string;
  resultData: MLSearchResult[] | null;
  isSuccessful: boolean;
  userId?: string;
  medicineId?: string;
  errorMessage?: string;
}

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
    @Request() req: AuthenticatedRequest,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<MLSearchResult[]> {
    if (!file) {
      throw new BadRequestException('No image file provided');
    }

    try {
      const results = (await this.medicinesService.searchByImageML(
        file,
      )) as MLSearchResult[];

      // Save user history
      try {
        const historyData: UserHistoryData = {
          actionType: 'scan',
          imageData: file.filename,
          resultData: results,
          isSuccessful: true,
          userId: req.user?.id,
        };

        if (results && results.length > 0 && results[0]?.id) {
          historyData.medicineId = results[0].id;
        }

        await this.medicinesService.saveUserHistory(historyData);
      } catch (historyError) {
        console.error('Failed to save user history:', historyError);
      }

      // If no results found, return empty array instead of throwing error
      if (!results || results.length === 0) {
        return [];
      }

      return results;
    } catch (error) {
      // Save user history for failed scan
      try {
        const historyData: UserHistoryData = {
          actionType: 'scan',
          imageData: file.filename,
          resultData: null,
          isSuccessful: false,
          errorMessage: (error as Error).message || 'Unknown error',
          userId: req.user?.id,
        };

        await this.medicinesService.saveUserHistory(historyData);
      } catch (historyError) {
        console.error(
          'Failed to save user history for failed scan:',
          historyError,
        );
      }

      // Log the error for debugging but don't expose internal details to client
      console.error('Image search error:', error);

      // Return empty array for non-medical images instead of error
      if (error instanceof NotFoundException) {
        return [];
      }

      // Re-throw other errors
      throw error;
    }
  }
}
