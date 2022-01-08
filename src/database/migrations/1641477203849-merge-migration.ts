import {MigrationInterface, QueryRunner} from "typeorm";

export class mergeMigration1641477203849 implements MigrationInterface {
    name = 'mergeMigration1641477203849'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`nemo_dev\`.\`amenity\` (\`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(100) NOT NULL, \`description\` text NULL, \`slug\` varchar(200) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`nemo_dev\`.\`roles\` (\`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`num\` smallint NOT NULL, \`label\` varchar(255) NOT NULL, \`description\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`nemo_dev\`.\`users\` (\`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(100) NOT NULL, \`password\` varchar(100) NOT NULL, \`fullname\` varchar(50) NOT NULL, \`phone_number\` varchar(50) NULL, \`avatar\` varchar(500) NULL, \`status\` tinyint NOT NULL DEFAULT '0', \`bio\` text NULL, \`role_id\` int NULL, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`nemo_dev\`.\`auth_identities\` (\`id\` int NOT NULL AUTO_INCREMENT, \`refresh_token\` varchar(500) NULL, \`email_verification_token\` varchar(500) NULL, \`email_verification_valid_until\` datetime NULL, \`password_reset_token\` varchar(500) NULL, \`password_reset_valid_until\` datetime NULL, \`user_id\` int NULL, UNIQUE INDEX \`REL_c06a980d83c42611d27a294e55\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`nemo_dev\`.\`locations\` (\`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`type\` varchar(100) NOT NULL, \`slug\` varchar(100) NOT NULL, \`description\` text NULL, \`mpath\` varchar(255) NULL DEFAULT '', \`parent_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`nemo_dev\`.\`service_image\` (\`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`url\` varchar(500) NOT NULL, \`fallback_url\` varchar(500) NOT NULL, \`service_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`nemo_dev\`.\`service\` (\`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(100) NOT NULL, \`description\` text NULL, \`slug\` varchar(200) NOT NULL, \`origin_url\` varchar(200) NULL, \`full_address\` varchar(200) NULL, \`phone_number\` varchar(200) NULL, \`thumbnail\` varchar(200) NULL, \`price\` int NULL, \`location_id\` int NULL, \`category_id\` int NULL, FULLTEXT INDEX \`IDX_eaae4b7c4571ef8eec883d6202\` (\`title\`), UNIQUE INDEX \`IDX_4df47ef659e04d5be78ddb6b59\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`nemo_dev\`.\`category\` (\`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(100) NOT NULL, \`description\` text NULL, \`slug\` varchar(200) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`nemo_dev\`.\`messages\` (\`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`body\` text NOT NULL, \`type\` tinyint NOT NULL DEFAULT '1', \`owner\` varchar(255) NOT NULL, \`interest_results\` text NULL, \`customer_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`nemo_dev\`.\`customers\` (\`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`long_id\` text NULL, \`email\` varchar(100) NULL, \`ip\` varchar(50) NULL, \`location\` varchar(50) NULL, \`viewed\` tinyint NOT NULL DEFAULT '0', \`current_stage\` tinyint NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`nemo_dev\`.\`nlp_results\` (\`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`body\` text NOT NULL, \`result\` text NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`nemo_dev\`.\`services_amenities_pivot\` (\`service_id\` int NOT NULL, \`amenity_id\` int NOT NULL, INDEX \`IDX_43a3ec4eb962491f90cee13469\` (\`service_id\`), INDEX \`IDX_7b1e7ddf75d752123c724da0d7\` (\`amenity_id\`), PRIMARY KEY (\`service_id\`, \`amenity_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`users\` ADD CONSTRAINT \`FK_a2cecd1a3531c0b041e29ba46e1\` FOREIGN KEY (\`role_id\`) REFERENCES \`nemo_dev\`.\`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`auth_identities\` ADD CONSTRAINT \`FK_c06a980d83c42611d27a294e55c\` FOREIGN KEY (\`user_id\`) REFERENCES \`nemo_dev\`.\`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`locations\` ADD CONSTRAINT \`FK_ce8370570fc9bb582e9510b94a0\` FOREIGN KEY (\`parent_id\`) REFERENCES \`nemo_dev\`.\`locations\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`service_image\` ADD CONSTRAINT \`FK_920a2216dd179b7069014c627c7\` FOREIGN KEY (\`service_id\`) REFERENCES \`nemo_dev\`.\`service\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`service\` ADD CONSTRAINT \`FK_266d99817ae218f072be6a6c831\` FOREIGN KEY (\`location_id\`) REFERENCES \`nemo_dev\`.\`locations\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`service\` ADD CONSTRAINT \`FK_9d513b39d251063f98f2a7b941d\` FOREIGN KEY (\`category_id\`) REFERENCES \`nemo_dev\`.\`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`messages\` ADD CONSTRAINT \`FK_9329a2ad0afbd9eb3e297628a92\` FOREIGN KEY (\`customer_id\`) REFERENCES \`nemo_dev\`.\`customers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`services_amenities_pivot\` ADD CONSTRAINT \`FK_43a3ec4eb962491f90cee134695\` FOREIGN KEY (\`service_id\`) REFERENCES \`nemo_dev\`.\`service\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`services_amenities_pivot\` ADD CONSTRAINT \`FK_7b1e7ddf75d752123c724da0d75\` FOREIGN KEY (\`amenity_id\`) REFERENCES \`nemo_dev\`.\`amenity\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`services_amenities_pivot\` DROP FOREIGN KEY \`FK_7b1e7ddf75d752123c724da0d75\``);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`services_amenities_pivot\` DROP FOREIGN KEY \`FK_43a3ec4eb962491f90cee134695\``);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`messages\` DROP FOREIGN KEY \`FK_9329a2ad0afbd9eb3e297628a92\``);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`service\` DROP FOREIGN KEY \`FK_9d513b39d251063f98f2a7b941d\``);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`service\` DROP FOREIGN KEY \`FK_266d99817ae218f072be6a6c831\``);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`service_image\` DROP FOREIGN KEY \`FK_920a2216dd179b7069014c627c7\``);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`locations\` DROP FOREIGN KEY \`FK_ce8370570fc9bb582e9510b94a0\``);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`auth_identities\` DROP FOREIGN KEY \`FK_c06a980d83c42611d27a294e55c\``);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`users\` DROP FOREIGN KEY \`FK_a2cecd1a3531c0b041e29ba46e1\``);
        await queryRunner.query(`DROP INDEX \`IDX_7b1e7ddf75d752123c724da0d7\` ON \`nemo_dev\`.\`services_amenities_pivot\``);
        await queryRunner.query(`DROP INDEX \`IDX_43a3ec4eb962491f90cee13469\` ON \`nemo_dev\`.\`services_amenities_pivot\``);
        await queryRunner.query(`DROP TABLE \`nemo_dev\`.\`services_amenities_pivot\``);
        await queryRunner.query(`DROP TABLE \`nemo_dev\`.\`nlp_results\``);
        await queryRunner.query(`DROP TABLE \`nemo_dev\`.\`customers\``);
        await queryRunner.query(`DROP TABLE \`nemo_dev\`.\`messages\``);
        await queryRunner.query(`DROP TABLE \`nemo_dev\`.\`category\``);
        await queryRunner.query(`DROP INDEX \`IDX_4df47ef659e04d5be78ddb6b59\` ON \`nemo_dev\`.\`service\``);
        await queryRunner.query(`DROP INDEX \`IDX_eaae4b7c4571ef8eec883d6202\` ON \`nemo_dev\`.\`service\``);
        await queryRunner.query(`DROP TABLE \`nemo_dev\`.\`service\``);
        await queryRunner.query(`DROP TABLE \`nemo_dev\`.\`service_image\``);
        await queryRunner.query(`DROP TABLE \`nemo_dev\`.\`locations\``);
        await queryRunner.query(`DROP INDEX \`REL_c06a980d83c42611d27a294e55\` ON \`nemo_dev\`.\`auth_identities\``);
        await queryRunner.query(`DROP TABLE \`nemo_dev\`.\`auth_identities\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`nemo_dev\`.\`users\``);
        await queryRunner.query(`DROP TABLE \`nemo_dev\`.\`users\``);
        await queryRunner.query(`DROP TABLE \`nemo_dev\`.\`roles\``);
        await queryRunner.query(`DROP TABLE \`nemo_dev\`.\`amenity\``);
    }

}
