const { execSync } = require('child_process');

console.log('🚀 Running database migrations...\n');

try {
  const output = execSync('npx typeorm-ts-node-commonjs migration:run -d src/data-source.ts', {
    cwd: __dirname,
    encoding: 'utf-8',
    stdio: 'pipe'
  });
  
  console.log(output);
  console.log('\n✅ Migrations completed successfully!');
} catch (error) {
  console.error('❌ Migration failed:');
  console.error(error.stdout || error.message);
  console.error(error.stderr);
  process.exit(1);
}
