# Database Management
npm run db:create       # Create the database
npm run db:check        # Check database structure
npm run db:migrate      # Run migrations with detailed output

# TypeORM CLI
npm run migration:run     # Run pending migrations
npm run migration:revert  # Revert last migration
npm run migration:show    # Show migration status
npm run migration:generate -- src/migrations/MigrationName  # Generate new migration