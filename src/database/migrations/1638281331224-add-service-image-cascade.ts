import {MigrationInterface, QueryRunner} from "typeorm";

export class addServiceImageCascade1638281331224 implements MigrationInterface {
    name = 'addServiceImageCascade1638281331224'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`service_image\` DROP FOREIGN KEY \`FK_920a2216dd179b7069014c627c7\``);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`service_image\` ADD CONSTRAINT \`FK_920a2216dd179b7069014c627c7\` FOREIGN KEY (\`service_id\`) REFERENCES \`nemo_dev\`.\`service\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`service_image\` DROP FOREIGN KEY \`FK_920a2216dd179b7069014c627c7\``);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`service_image\` ADD CONSTRAINT \`FK_920a2216dd179b7069014c627c7\` FOREIGN KEY (\`service_id\`) REFERENCES \`nemo_dev\`.\`service\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
