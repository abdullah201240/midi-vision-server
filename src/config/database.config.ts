import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';

dotenvConfig({ path: '.env' });

// Determine if we're running from dist or src
const isCompiled = __dirname.includes('dist');

export const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: isCompiled
    ? [join(__dirname, '..', '**', '*.entity.js')]
    : [join(__dirname, '..', '**', '*.entity.ts')],
  migrations: isCompiled
    ? [join(__dirname, '..', 'migrations', '*.js')]
    : [join(__dirname, '..', 'migrations', '*.ts')],
  migrationsTableName: 'typeorm_migrations',
  synchronize: process.env.TYPEORM_SYNCHRONIZE === 'false',
  logging: process.env.TYPEORM_LOGGING === 'true',
};

export default registerAs('typeorm', () => databaseConfig);
export const connectionSource = new DataSource(databaseConfig);