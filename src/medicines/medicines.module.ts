import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicinesService } from './medicines.service';
import { MedicinesController } from './medicines.controller';
import { Medicine } from './entities/medicine.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Medicine]), UsersModule],
  providers: [MedicinesService],
  controllers: [MedicinesController],
  exports: [MedicinesService],
})
export class MedicinesModule {}
