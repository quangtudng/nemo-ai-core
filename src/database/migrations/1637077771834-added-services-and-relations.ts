import {MigrationInterface, QueryRunner} from "typeorm";

export class addedServicesAndRelations1637077771834 implements MigrationInterface {
    name = 'addedServicesAndRelations1637077771834'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`nemo_dev\`.\`service\` (\`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(100) NOT NULL, \`description\` text NULL, \`slug\` varchar(200) NOT NULL, \`origin_url\` varchar(200) NULL, \`full_address\` varchar(200) NULL, \`phone_number\` varchar(200) NULL, \`thumbnail\` varchar(200) NULL, \`price\` int NULL, \`location_id\` int NULL, \`category_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`nemo_dev\`.\`services_amenities_pivot\` (\`service_id\` int NOT NULL, \`amenity_id\` int NOT NULL, INDEX \`IDX_43a3ec4eb962491f90cee13469\` (\`service_id\`), INDEX \`IDX_7b1e7ddf75d752123c724da0d7\` (\`amenity_id\`), PRIMARY KEY (\`service_id\`, \`amenity_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`service_image\` ADD \`service_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`service_image\` ADD CONSTRAINT \`FK_920a2216dd179b7069014c627c7\` FOREIGN KEY (\`service_id\`) REFERENCES \`nemo_dev\`.\`service\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`service\` ADD CONSTRAINT \`FK_266d99817ae218f072be6a6c831\` FOREIGN KEY (\`location_id\`) REFERENCES \`nemo_dev\`.\`locations\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`service\` ADD CONSTRAINT \`FK_9d513b39d251063f98f2a7b941d\` FOREIGN KEY (\`category_id\`) REFERENCES \`nemo_dev\`.\`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`services_amenities_pivot\` ADD CONSTRAINT \`FK_43a3ec4eb962491f90cee134695\` FOREIGN KEY (\`service_id\`) REFERENCES \`nemo_dev\`.\`service\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`services_amenities_pivot\` ADD CONSTRAINT \`FK_7b1e7ddf75d752123c724da0d75\` FOREIGN KEY (\`amenity_id\`) REFERENCES \`nemo_dev\`.\`amenity\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`services_amenities_pivot\` DROP FOREIGN KEY \`FK_7b1e7ddf75d752123c724da0d75\``);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`services_amenities_pivot\` DROP FOREIGN KEY \`FK_43a3ec4eb962491f90cee134695\``);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`service\` DROP FOREIGN KEY \`FK_9d513b39d251063f98f2a7b941d\``);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`service\` DROP FOREIGN KEY \`FK_266d99817ae218f072be6a6c831\``);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`service_image\` DROP FOREIGN KEY \`FK_920a2216dd179b7069014c627c7\``);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`service_image\` DROP COLUMN \`service_id\``);
        await queryRunner.query(`DROP INDEX \`IDX_7b1e7ddf75d752123c724da0d7\` ON \`nemo_dev\`.\`services_amenities_pivot\``);
        await queryRunner.query(`DROP INDEX \`IDX_43a3ec4eb962491f90cee13469\` ON \`nemo_dev\`.\`services_amenities_pivot\``);
        await queryRunner.query(`DROP TABLE \`nemo_dev\`.\`services_amenities_pivot\``);
        await queryRunner.query(`DROP TABLE \`nemo_dev\`.\`service\``);
    }

}
