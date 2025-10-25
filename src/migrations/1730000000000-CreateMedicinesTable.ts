import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateMedicinesTable1730000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'medicines',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'details',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'origin',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'sideEffects',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'usage',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'howToUse',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'images',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'medicines',
      new TableIndex({
        name: 'IDX_MEDICINES_NAME',
        columnNames: ['name'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('medicines', 'IDX_MEDICINES_NAME');
    await queryRunner.dropTable('medicines');
  }
}
