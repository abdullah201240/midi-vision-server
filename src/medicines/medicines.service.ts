import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medicine } from './entities/medicine.entity';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { MedicineResponseDto } from './dto/medicine-response.dto';
import { PaginatedMedicineResponseDto } from './dto/paginated-response.dto';
import { unlink } from 'fs/promises';
import { join } from 'path';
import axios from 'axios';
import FormData from 'form-data';
import { createReadStream } from 'fs';

export interface FindAllOptions {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

@Injectable()
export class MedicinesService {
  constructor(
    @InjectRepository(Medicine)
    private medicineRepository: Repository<Medicine>,
  ) {}

  async create(
    createMedicineDto: CreateMedicineDto,
    images?: string[],
  ): Promise<MedicineResponseDto> {
    const medicine = this.medicineRepository.create({
      ...createMedicineDto,
      images: images || [],
    });

    const savedMedicine = await this.medicineRepository.save(medicine);

    // Notify ML service about the new medicine
    this.notifyMLService();

    return new MedicineResponseDto(savedMedicine);
  }

  async findAll(
    options?: FindAllOptions,
  ): Promise<PaginatedMedicineResponseDto | MedicineResponseDto[]> {
    // If no options provided, return all medicines (backward compatibility)
    if (!options) {
      const medicines = await this.medicineRepository.find();
      return medicines.map((medicine) => new MedicineResponseDto(medicine));
    }

    const {
      page,
      limit,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = options;

    // Build query
    const queryBuilder = this.medicineRepository.createQueryBuilder('medicine');

    // Apply search filter
    if (search) {
      queryBuilder.where(
        '(medicine.name ILIKE :search OR medicine.nameBn ILIKE :search OR medicine.brand ILIKE :search OR medicine.brandBn ILIKE :search OR medicine.details ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Apply sorting
    const validSortFields = ['name', 'brand', 'origin', 'createdAt'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    queryBuilder.orderBy(`medicine.${sortField}`, sortOrder);

    // Get total count
    const total = await queryBuilder.getCount();

    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Execute query
    const medicines = await queryBuilder.getMany();

    const data = medicines.map((medicine) => new MedicineResponseDto(medicine));
    return new PaginatedMedicineResponseDto(data, total, page, limit);
  }

  async findOne(id: string): Promise<MedicineResponseDto> {
    const medicine = await this.medicineRepository.findOne({ where: { id } });
    if (!medicine) {
      throw new NotFoundException(`Medicine with ID "${id}" not found`);
    }
    return new MedicineResponseDto(medicine);
  }

  async update(
    id: string,
    updateMedicineDto: UpdateMedicineDto,
    newImages?: string[],
  ): Promise<MedicineResponseDto> {
    const medicine = await this.medicineRepository.findOne({ where: { id } });
    if (!medicine) {
      throw new NotFoundException(`Medicine with ID "${id}" not found`);
    }

    // If new images are uploaded, append to existing images
    if (newImages && newImages.length > 0) {
      medicine.images = [...(medicine.images || []), ...newImages];
    }

    Object.assign(medicine, updateMedicineDto);
    const updatedMedicine = await this.medicineRepository.save(medicine);

    // Notify ML service about the updated medicine
    this.notifyMLService();

    return new MedicineResponseDto(updatedMedicine);
  }

  async remove(id: string): Promise<void> {
    const medicine = await this.medicineRepository.findOne({ where: { id } });
    if (!medicine) {
      throw new NotFoundException(`Medicine with ID "${id}" not found`);
    }

    // Delete all associated images from filesystem
    if (medicine.images && medicine.images.length > 0) {
      await Promise.all(
        medicine.images.map(async (image) => {
          try {
            await unlink(join(process.cwd(), 'uploads', 'medicines', image));
          } catch (error) {
            console.error(`Failed to delete image ${image}:`, error);
          }
        }),
      );
    }

    await this.medicineRepository.remove(medicine);

    // Notify ML service about the removed medicine
    this.notifyMLService();
  }

  async removeImage(
    id: string,
    imageName: string,
  ): Promise<MedicineResponseDto> {
    const medicine = await this.medicineRepository.findOne({ where: { id } });
    if (!medicine) {
      throw new NotFoundException(`Medicine with ID "${id}" not found`);
    }

    if (!medicine.images || !medicine.images.includes(imageName)) {
      throw new NotFoundException(
        `Image "${imageName}" not found for this medicine`,
      );
    }

    // Remove image from filesystem
    try {
      await unlink(join(process.cwd(), 'uploads', 'medicines', imageName));
    } catch (error) {
      console.error(`Failed to delete image ${imageName}:`, error);
    }

    // Remove image from array
    medicine.images = medicine.images.filter((img) => img !== imageName);
    const updatedMedicine = await this.medicineRepository.save(medicine);

    // Notify ML service about the updated medicine
    this.notifyMLService();

    return new MedicineResponseDto(updatedMedicine);
  }

  async searchByImageML(file: Express.Multer.File): Promise<any[]> {
    try {
      const formData = new FormData();
      const filePath = join(
        process.cwd(),
        'uploads',
        'medicines',
        file.filename,
      );
      formData.append('image', createReadStream(filePath));

      console.log('Sending image to ML server:', file.filename);

      const response = await axios.post<any[]>(
        'http://localhost:5001/search',
        formData,
        {
          headers: formData.getHeaders(),
          timeout: 60000, // 60 second timeout for large image processing
        },
      );

      console.log(`ML search found ${response.data.length} results`);

      // Clean up uploaded file
      try {
        await unlink(filePath);
      } catch (error) {
        console.error('Failed to delete uploaded file:', error);
      }

      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error('ML search error:', errorMessage);

      // Clean up uploaded file in case of error
      try {
        const filePath = join(
          process.cwd(),
          'uploads',
          'medicines',
          file.filename,
        );
        await unlink(filePath);
      } catch (unlinkError) {
        console.error('Failed to delete uploaded file:', unlinkError);
      }

      // Check if it's a timeout error
      if (
        error instanceof Error &&
        (errorMessage.includes('timeout') ||
          errorMessage.includes('ECONNABORTED'))
      ) {
        throw new NotFoundException(
          'Image search timed out. The image might be too large or the ML server is busy. Please try again.',
        );
      }

      throw new NotFoundException(
        'Image search failed. Make sure the ML server is running on port 5001.',
      );
    }
  }

  /**
   * Notify the ML service to refresh its medicine cache
   */
  private notifyMLService(): void {
    // Don't wait for the response, just send the notification
    void axios
      .post(
        'http://localhost:5001/refresh-medicines',
        {},
        {
          timeout: 10000, // 10 second timeout
        },
      )
      .then((response) => {
        console.log('ML service notified successfully:', response.data);
      })
      .catch((error) => {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.warn('Failed to notify ML service:', errorMessage);
      });
  }
}
