import {MigrationInterface, QueryRunner} from "typeorm";

export class addServiceImageCascadeUpdate1638284378619 implements MigrationInterface {
    name = 'addServiceImageCascadeUpdate1638284378619'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`service_image\` DROP FOREIGN KEY \`FK_920a2216dd179b7069014c627c7\``);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`service\` ADD UNIQUE INDEX \`IDX_4df47ef659e04d5be78ddb6b59\` (\`slug\`)`);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`service_image\` ADD CONSTRAINT \`FK_920a2216dd179b7069014c627c7\` FOREIGN KEY (\`service_id\`) REFERENCES \`nemo_dev\`.\`service\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`service_image\` DROP FOREIGN KEY \`FK_920a2216dd179b7069014c627c7\``);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`service\` DROP INDEX \`IDX_4df47ef659e04d5be78ddb6b59\``);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`service_image\` ADD CONSTRAINT \`FK_920a2216dd179b7069014c627c7\` FOREIGN KEY (\`service_id\`) REFERENCES \`nemo_dev\`.\`service\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
