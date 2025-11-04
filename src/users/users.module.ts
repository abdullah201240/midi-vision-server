import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UserHistory } from './entities/user-history.entity';
import { Medicine } from '../medicines/entities/medicine.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserHistory, Medicine])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
