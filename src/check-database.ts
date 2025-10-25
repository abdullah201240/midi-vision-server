import { AppDataSource } from './data-source';

async function checkDatabase() {
  try {
    console.log('Initializing data source...');
    await AppDataSource.initialize();
    console.log('Data source initialized successfully');

    // Check if role column exists
    const query = `
      SELECT column_name, data_type, column_default
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `;

    const columns = await AppDataSource.query(query);
    console.log('\nColumns in users table:');
    console.log(columns);

    // Check migrations
    const migrations = await AppDataSource.query(
      'SELECT * FROM typeorm_migrations ORDER BY timestamp DESC'
    );
    console.log('\nApplied migrations:');
    console.log(migrations);

    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkDatabase();
