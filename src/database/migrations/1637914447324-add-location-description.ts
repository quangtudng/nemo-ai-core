import {MigrationInterface, QueryRunner} from "typeorm";

export class addLocationDescription1637914447324 implements MigrationInterface {
    name = 'addLocationDescription1637914447324'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`locations\` ADD \`description\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`locations\` DROP COLUMN \`description\``);
    }

}
