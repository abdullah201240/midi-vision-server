import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddBengaliFieldsToMedicines1761400000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add Bengali fields to medicines table
    await queryRunner.addColumn(
      'medicines',
      new TableColumn({
        name: 'nameBn',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'medicines',
      new TableColumn({
        name: 'brandBn',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'medicines',
      new TableColumn({
        name: 'detailsBn',
        type: 'text',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'medicines',
      new TableColumn({
        name: 'originBn',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'medicines',
      new TableColumn({
        name: 'sideEffectsBn',
        type: 'text',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'medicines',
      new TableColumn({
        name: 'usageBn',
        type: 'text',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'medicines',
      new TableColumn({
        name: 'howToUseBn',
        type: 'text',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('medicines', 'howToUseBn');
    await queryRunner.dropColumn('medicines', 'usageBn');
    await queryRunner.dropColumn('medicines', 'sideEffectsBn');
    await queryRunner.dropColumn('medicines', 'originBn');
    await queryRunner.dropColumn('medicines', 'detailsBn');
    await queryRunner.dropColumn('medicines', 'brandBn');
    await queryRunner.dropColumn('medicines', 'nameBn');
  }
}
