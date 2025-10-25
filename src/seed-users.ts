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

async function seedUsers() {
  try {
    console.log('Connecting to database...');
    await AppDataSource.initialize();
    console.log('Database connected successfully!');

    const userRepository = AppDataSource.getRepository(User);

    // Hash password for all users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Password123!', salt);

    const usersData = [
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: hashedPassword,
        phone: '+1234567890',
        gender: 'male',
        dateOfBirth: new Date('1990-05-15'),
        image: 'https://i.pravatar.cc/150?img=1',
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        password: hashedPassword,
        phone: '+1234567891',
        gender: 'female',
        dateOfBirth: new Date('1992-08-20'),
        image: 'https://i.pravatar.cc/150?img=2',
      },
      {
        name: 'Mike Johnson',
        email: 'mike.johnson@example.com',
        password: hashedPassword,
        phone: '+1234567892',
        gender: 'male',
        dateOfBirth: new Date('1988-03-10'),
        image: 'https://i.pravatar.cc/150?img=3',
      },
      {
        name: 'Emily Davis',
        email: 'emily.davis@example.com',
        password: hashedPassword,
        phone: '+1234567893',
        gender: 'female',
        dateOfBirth: new Date('1995-11-25'),
        image: 'https://i.pravatar.cc/150?img=4',
      },
      {
        name: 'Alex Taylor',
        email: 'alex.taylor@example.com',
        password: hashedPassword,
        phone: '+1234567894',
        gender: 'other',
        dateOfBirth: new Date('1993-07-18'),
        image: 'https://i.pravatar.cc/150?img=5',
      },
    ];

    console.log('\nSeeding users...');
    
    for (const userData of usersData) {
      // Check if user already exists
      const existingUser = await userRepository.findOne({
        where: { email: userData.email },
      });

      if (existingUser) {
        console.log(`User ${userData.email} already exists. Skipping...`);
        continue;
      }

      const user = userRepository.create(userData);
      await userRepository.save(user);
      console.log(`✓ Created user: ${userData.name} (${userData.email})`);
    }

    console.log('\n✅ User seeding completed successfully!');
    console.log('\nTest credentials:');
    console.log('Email: any of the above emails');
    console.log('Password: Password123!');

    await AppDataSource.destroy();
    console.log('\nDatabase connection closed.');
  } catch (error) {
    console.error('Error seeding users:', error);
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    process.exit(1);
  }
}

seedUsers();
