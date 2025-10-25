import { AppDataSource } from './data-source';

async function addBengaliFields() {
  try {
    console.log('Initializing data source...');
    await AppDataSource.initialize();
    console.log('Data source initialized successfully');

    console.log('\nAdding Bengali fields to medicines table...');

    const queries = [
      `ALTER TABLE medicines ADD COLUMN IF NOT EXISTS "nameBn" VARCHAR(255)`,
      `ALTER TABLE medicines ADD COLUMN IF NOT EXISTS "brandBn" VARCHAR(255)`,
      `ALTER TABLE medicines ADD COLUMN IF NOT EXISTS "detailsBn" TEXT`,
      `ALTER TABLE medicines ADD COLUMN IF NOT EXISTS "originBn" VARCHAR(255)`,
      `ALTER TABLE medicines ADD COLUMN IF NOT EXISTS "sideEffectsBn" TEXT`,
      `ALTER TABLE medicines ADD COLUMN IF NOT EXISTS "usageBn" TEXT`,
      `ALTER TABLE medicines ADD COLUMN IF NOT EXISTS "howToUseBn" TEXT`,
    ];

    for (const query of queries) {
      console.log(`Executing: ${query}`);
      await AppDataSource.query(query);
    }

    console.log('\n✅ Successfully added Bengali fields!');

    // Verify the columns
    interface ColumnInfo {
      column_name: string;
      data_type: string;
    }

    const columns: ColumnInfo[] = await AppDataSource.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'medicines'
      ORDER BY ordinal_position;
    `);

    console.log('\nCurrent medicine table columns:');
    console.log(columns);

    await AppDataSource.destroy();
    console.log('\n✅ Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    process.exit(1);
  }
}

void addBengaliFields();
