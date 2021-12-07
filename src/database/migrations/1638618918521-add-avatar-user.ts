import {MigrationInterface, QueryRunner} from "typeorm";

export class addAvatarUser1638618918521 implements MigrationInterface {
    name = 'addAvatarUser1638618918521'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`users\` ADD \`avatar\` varchar(500) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`users\` DROP COLUMN \`avatar\``);
    }

}
