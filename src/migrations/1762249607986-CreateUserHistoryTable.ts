import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserHistoryTable1762249607986 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "user_histories" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "actionType" character varying(50) NOT NULL,
        "imageData" text,
        "resultData" jsonb,
        "isSuccessful" boolean NOT NULL DEFAULT false,
        "errorMessage" text,
        "userId" uuid,
        "medicineId" uuid,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_user_histories" PRIMARY KEY ("id"),
        CONSTRAINT "FK_user_histories_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_user_histories_medicine" FOREIGN KEY ("medicineId") REFERENCES "medicines"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_user_histories_user_id" ON "user_histories" ("userId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_user_histories_medicine_id" ON "user_histories" ("medicineId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_user_histories_action_type" ON "user_histories" ("actionType")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_user_histories_created_at" ON "user_histories" ("createdAt")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_user_histories_created_at"');
    await queryRunner.query('DROP INDEX "IDX_user_histories_action_type"');
    await queryRunner.query('DROP INDEX "IDX_user_histories_medicine_id"');
    await queryRunner.query('DROP INDEX "IDX_user_histories_user_id"');
    await queryRunner.query('DROP TABLE "user_histories"');
  }
}
