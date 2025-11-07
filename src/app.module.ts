import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MedicinesModule } from './medicines/medicines.module';
import { User } from './users/entities/user.entity';
import { UserHistory } from './users/entities/user-history.entity';
import { Medicine } from './medicines/entities/medicine.entity';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads/',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, UserHistory, Medicine],
      synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
      logging: false,
    }),
    UsersModule,
    AuthModule,
    MedicinesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
