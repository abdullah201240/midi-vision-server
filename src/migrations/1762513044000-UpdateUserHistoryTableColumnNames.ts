import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserHistoryTableColumnNames1762513044000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Rename userId column to user_id
    await queryRunner.query(`
      ALTER TABLE "user_histories" RENAME COLUMN "userId" TO "user_id"
    `);

    // Rename medicineId column to medicine_id
    await queryRunner.query(`
      ALTER TABLE "user_histories" RENAME COLUMN "medicineId" TO "medicine_id"
    `);

    // Update the foreign key constraint for user_id
    await queryRunner.query(`
      ALTER TABLE "user_histories" 
      DROP CONSTRAINT "FK_user_histories_user"
    `);
    
    await queryRunner.query(`
      ALTER TABLE "user_histories" 
      ADD CONSTRAINT "FK_user_histories_user" 
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
    `);

    // Update the foreign key constraint for medicine_id
    await queryRunner.query(`
      ALTER TABLE "user_histories" 
      DROP CONSTRAINT "FK_user_histories_medicine"
    `);
    
    await queryRunner.query(`
      ALTER TABLE "user_histories" 
      ADD CONSTRAINT "FK_user_histories_medicine" 
      FOREIGN KEY ("medicine_id") REFERENCES "medicines"("id") ON DELETE SET NULL
    `);

    // Update the indexes
    await queryRunner.query(`
      DROP INDEX "IDX_user_histories_user_id"
    `);
    
    await queryRunner.query(`
      CREATE INDEX "IDX_user_histories_user_id" ON "user_histories" ("user_id")
    `);

    await queryRunner.query(`
      DROP INDEX "IDX_user_histories_medicine_id"
    `);
    
    await queryRunner.query(`
      CREATE INDEX "IDX_user_histories_medicine_id" ON "user_histories" ("medicine_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Rename user_id column back to userId
    await queryRunner.query(`
      ALTER TABLE "user_histories" RENAME COLUMN "user_id" TO "userId"
    `);

    // Rename medicine_id column back to medicineId
    await queryRunner.query(`
      ALTER TABLE "user_histories" RENAME COLUMN "medicine_id" TO "medicineId"
    `);

    // Update the foreign key constraint for userId
    await queryRunner.query(`
      ALTER TABLE "user_histories" 
      DROP CONSTRAINT "FK_user_histories_user"
    `);
    
    await queryRunner.query(`
      ALTER TABLE "user_histories" 
      ADD CONSTRAINT "FK_user_histories_user" 
      FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
    `);

    // Update the foreign key constraint for medicineId
    await queryRunner.query(`
      ALTER TABLE "user_histories" 
      DROP CONSTRAINT "FK_user_histories_medicine"
    `);
    
    await queryRunner.query(`
      ALTER TABLE "user_histories" 
      ADD CONSTRAINT "FK_user_histories_medicine" 
      FOREIGN KEY ("medicineId") REFERENCES "medicines"("id") ON DELETE SET NULL
    `);

    // Update the indexes
    await queryRunner.query(`
      DROP INDEX "IDX_user_histories_user_id"
    `);
    
    await queryRunner.query(`
      CREATE INDEX "IDX_user_histories_user_id" ON "user_histories" ("userId")
    `);

    await queryRunner.query(`
      DROP INDEX "IDX_user_histories_medicine_id"
    `);
    
    await queryRunner.query(`
      CREATE INDEX "IDX_user_histories_medicine_id" ON "user_histories" ("medicineId")
    `);
  }
}