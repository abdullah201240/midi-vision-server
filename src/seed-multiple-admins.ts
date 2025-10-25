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

async function seedMultipleAdmins() {
  try {
    console.log('Connecting to database...');
    await AppDataSource.initialize();
    console.log('Database connected successfully!');

    const userRepository = AppDataSource.getRepository(User);

    // Define 5 admin users
    const admins = [
      {
        name: 'System Admin',
        email: 'admin@midivision.com',
        password: 'Admin@123',
        phone: '+1234567890',
        gender: 'other',
        role: 'admin',
      },
      {
        name: 'John Admin',
        email: 'john.admin@midivision.com',
        password: 'John@123',
        phone: '+1234567891',
        gender: 'male',
        role: 'admin',
      },
      {
        name: 'Sarah Admin',
        email: 'sarah.admin@midivision.com',
        password: 'Sarah@123',
        phone: '+1234567892',
        gender: 'female',
        role: 'admin',
      },
      {
        name: 'Mike Admin',
        email: 'mike.admin@midivision.com',
        password: 'Mike@123',
        phone: '+1234567893',
        gender: 'male',
        role: 'admin',
      },
      {
        name: 'Lisa Admin',
        email: 'lisa.admin@midivision.com',
        password: 'Lisa@123',
        phone: '+1234567894',
        gender: 'female',
        role: 'admin',
      },
    ];

    console.log('\nCreating admin users...\n');
    let createdCount = 0;
    let existingCount = 0;

    for (const adminData of admins) {
      // Check if admin already exists
      const existingAdmin = await userRepository.findOne({
        where: { email: adminData.email },
      });

      if (existingAdmin) {
        console.log(`⚠ Admin already exists: ${adminData.email}`);
        existingCount++;
      } else {
        // Hash password for admin
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminData.password, salt);

        const admin = userRepository.create({
          ...adminData,
          password: hashedPassword,
        });
        await userRepository.save(admin);
        console.log(`✓ Created admin: ${adminData.name} (${adminData.email})`);
        createdCount++;
      }
    }

    console.log('\n✅ Admin seeding completed!');
    console.log(`Created: ${createdCount} new admin(s)`);
    console.log(`Existing: ${existingCount} admin(s)`);
    
    console.log('\n📋 Admin Credentials List:');
    console.log('═'.repeat(60));
    admins.forEach((admin, index) => {
      console.log(`${index + 1}. ${admin.name}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Password: ${admin.password}`);
      console.log('─'.repeat(60));
    });

    await AppDataSource.destroy();
    console.log('\n✅ Database connection closed.');
  } catch (error) {
    console.error('❌ Error seeding admins:', error);
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    process.exit(1);
  }
}

seedMultipleAdmins();
