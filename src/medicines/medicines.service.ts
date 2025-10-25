import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Medicine } from './entities/medicine.entity';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { MedicineResponseDto } from './dto/medicine-response.dto';
import { PaginatedMedicineResponseDto } from './dto/paginated-response.dto';
import { unlink } from 'fs/promises';
import { join } from 'path';

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
    return new MedicineResponseDto(savedMedicine);
  }

  async findAll(options?: FindAllOptions): Promise<PaginatedMedicineResponseDto | MedicineResponseDto[]> {
    // If no options provided, return all medicines (backward compatibility)
    if (!options) {
      const medicines = await this.medicineRepository.find();
      return medicines.map((medicine) => new MedicineResponseDto(medicine));
    }

    const { page, limit, search, sortBy = 'createdAt', sortOrder = 'DESC' } = options;
    
    // Build query
    const queryBuilder = this.medicineRepository.createQueryBuilder('medicine');

    // Apply search filter
    if (search) {
      queryBuilder.where(
        '(medicine.name ILIKE :search OR medicine.nameBn ILIKE :search OR medicine.brand ILIKE :search OR medicine.brandBn ILIKE :search OR medicine.details ILIKE :search)',
        { search: `%${search}%` }
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
  }

  async removeImage(id: string, imageName: string): Promise<MedicineResponseDto> {
    const medicine = await this.medicineRepository.findOne({ where: { id } });
    if (!medicine) {
      throw new NotFoundException(`Medicine with ID "${id}" not found`);
    }

    if (!medicine.images || !medicine.images.includes(imageName)) {
      throw new NotFoundException(`Image "${imageName}" not found for this medicine`);
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
    return new MedicineResponseDto(updatedMedicine);
  }
}
