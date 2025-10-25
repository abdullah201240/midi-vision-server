import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddRoleToUsers1761379181361 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create ENUM type first
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE users_role_enum AS ENUM('user', 'admin');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Add role column
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'role',
        type: 'users_role_enum',
        default: "'user'",
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'role');
    await queryRunner.query('DROP TYPE IF EXISTS users_role_enum');
  }
}
