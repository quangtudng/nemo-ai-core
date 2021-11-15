import {MigrationInterface, QueryRunner} from "typeorm";

export class addedCategoryTimestamp1636988272347 implements MigrationInterface {
    name = 'addedCategoryTimestamp1636988272347'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`category\` ADD \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`category\` ADD \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`category\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`category\` DROP COLUMN \`created_at\``);
    }

}
