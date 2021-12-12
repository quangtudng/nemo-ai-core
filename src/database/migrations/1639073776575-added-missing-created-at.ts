import {MigrationInterface, QueryRunner} from "typeorm";

export class addedMissingCreatedAt1639073776575 implements MigrationInterface {
    name = 'addedMissingCreatedAt1639073776575'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`locations\` ADD \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`locations\` ADD \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`users\` CHANGE \`fullname\` \`fullname\` varchar(50) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`users\` CHANGE \`fullname\` \`fullname\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`locations\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`locations\` DROP COLUMN \`created_at\``);
    }

}
