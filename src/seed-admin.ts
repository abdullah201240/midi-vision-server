import { DataSource } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import * as bcrypt from 'bcrypt';
import { User } from './users/entities/user.entity';

// Load environment variables
dotenvConfig({ path: '.env' });

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'MidiVision',
  entities: [User],
  synchronize: false,
  logging: true,
});

async function seedAdmin() {
  try {
    console.log('Connecting to database...');
    await AppDataSource.initialize();
    console.log('Database connected successfully!');

    const userRepository = AppDataSource.getRepository(User);

    // Hash password for admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@123', salt);

    const adminData = {
      name: 'System Admin',
      email: 'admin@midivision.com',
      password: hashedPassword,
      phone: '+1234567890',
      gender: 'other',
      role: 'admin',
    };

    console.log('\nCreating admin user...');

    // Check if admin already exists
    const existingAdmin = await userRepository.findOne({
      where: { email: adminData.email },
    });

    if (existingAdmin) {
      console.log(`Admin user already exists: ${adminData.email}`);
    } else {
      const admin = userRepository.create(adminData);
      await userRepository.save(admin);
      console.log(
        `✓ Created admin user: ${adminData.name} (${adminData.email})`,
      );
    }

    console.log('\n✅ Admin seeding completed successfully!');
    console.log('\nAdmin credentials:');
    console.log('Email: admin@midivision.com');
    console.log('Password: Admin@123');
    console.log('Role: admin');

    await AppDataSource.destroy();
    console.log('\nDatabase connection closed.');
  } catch (error) {
    console.error('Error seeding admin:', error);
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    process.exit(1);
  }
}

void seedAdmin();
