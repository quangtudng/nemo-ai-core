import {MigrationInterface, QueryRunner} from "typeorm";

export class updateUserEntity1637394864972 implements MigrationInterface {
    name = 'updateUserEntity1637394864972'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`users\` DROP COLUMN \`firstname\``);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`users\` DROP COLUMN \`lastname\``);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`users\` ADD \`fullname\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`users\` ADD \`phone_number\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`users\` ADD \`bio\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`users\` DROP COLUMN \`bio\``);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`users\` DROP COLUMN \`phone_number\``);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`users\` DROP COLUMN \`fullname\``);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`users\` ADD \`lastname\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`users\` ADD \`firstname\` varchar(50) NULL`);
    }

}
