import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateUserImageFieldsToNullable1761546276200 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Update image column to explicitly allow null
    await queryRunner.changeColumn(
      'users',
      'image',
      new TableColumn({
        name: 'image',
        type: 'varchar',
        length: '500',
        isNullable: true,
      }),
    );

    // Update coverPhoto column to explicitly allow null
    await queryRunner.changeColumn(
      'users',
      'coverPhoto',
      new TableColumn({
        name: 'coverPhoto',
        type: 'varchar',
        length: '500',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert image column
    await queryRunner.changeColumn(
      'users',
      'image',
      new TableColumn({
        name: 'image',
        type: 'varchar',
        length: '500',
        isNullable: true,
      }),
    );

    // Revert coverPhoto column
    await queryRunner.changeColumn(
      'users',
      'coverPhoto',
      new TableColumn({
        name: 'coverPhoto',
        type: 'varchar',
        length: '500',
        isNullable: true,
      }),
    );
  }
}