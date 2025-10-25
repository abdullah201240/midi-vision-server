import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddBrandToMedicines1761375945815 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'medicines',
      new TableColumn({
        name: 'brand',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('medicines', 'brand');
  }
}
