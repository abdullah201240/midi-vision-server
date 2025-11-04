import { DataSource } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import { User } from './users/entities/user.entity';
import { Medicine } from './medicines/entities/medicine.entity';

// Load environment variables
dotenvConfig({ path: '.env' });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'midi_vision',
  entities: [User, Medicine],
  migrations: [__dirname + '/migrations/*.ts'],
  migrationsTableName: 'typeorm_migrations',
  synchronize: false,
  logging: process.env.TYPEORM_LOGGING === 'true',
});
