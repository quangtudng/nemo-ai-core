import {MigrationInterface, QueryRunner} from "typeorm";

export class addRoleDescription1637470784614 implements MigrationInterface {
    name = 'addRoleDescription1637470784614'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`roles\` ADD \`description\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`roles\` DROP COLUMN \`description\``);
    }

}
