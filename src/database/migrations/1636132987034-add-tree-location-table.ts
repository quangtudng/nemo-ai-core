import {MigrationInterface, QueryRunner} from "typeorm";

export class addTreeLocationTable1636132987034 implements MigrationInterface {
    name = 'addTreeLocationTable1636132987034'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`nemo_dev\`.\`locations\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`type\` varchar(100) NOT NULL, \`slug\` varchar(100) NOT NULL, \`mpath\` varchar(255) NULL DEFAULT '', \`parent_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`locations\` ADD CONSTRAINT \`FK_ce8370570fc9bb582e9510b94a0\` FOREIGN KEY (\`parent_id\`) REFERENCES \`nemo_dev\`.\`locations\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`locations\` DROP FOREIGN KEY \`FK_ce8370570fc9bb582e9510b94a0\``);
        await queryRunner.query(`DROP TABLE \`nemo_dev\`.\`locations\``);
    }

}
