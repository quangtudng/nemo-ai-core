import {MigrationInterface, QueryRunner} from "typeorm";

export class addedCategoryTable1635959107618 implements MigrationInterface {
    name = 'addedCategoryTable1635959107618'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`nemo_dev\`.\`category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(100) NOT NULL, \`description\` text NOT NULL, \`slug\` varchar(200) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`users\` DROP FOREIGN KEY \`FK_a2cecd1a3531c0b041e29ba46e1\``);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`users\` CHANGE \`role_id\` \`role_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`auth_identities\` DROP FOREIGN KEY \`FK_c06a980d83c42611d27a294e55c\``);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`auth_identities\` CHANGE \`refresh_token\` \`refresh_token\` varchar(500) NULL`);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`auth_identities\` CHANGE \`email_verification_token\` \`email_verification_token\` varchar(500) NULL`);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`auth_identities\` CHANGE \`email_verification_valid_until\` \`email_verification_valid_until\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`auth_identities\` CHANGE \`password_reset_token\` \`password_reset_token\` varchar(500) NULL`);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`auth_identities\` CHANGE \`password_reset_valid_until\` \`password_reset_valid_until\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`auth_identities\` CHANGE \`user_id\` \`user_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`users\` ADD CONSTRAINT \`FK_a2cecd1a3531c0b041e29ba46e1\` FOREIGN KEY (\`role_id\`) REFERENCES \`nemo_dev\`.\`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`auth_identities\` ADD CONSTRAINT \`FK_c06a980d83c42611d27a294e55c\` FOREIGN KEY (\`user_id\`) REFERENCES \`nemo_dev\`.\`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`auth_identities\` DROP FOREIGN KEY \`FK_c06a980d83c42611d27a294e55c\``);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`users\` DROP FOREIGN KEY \`FK_a2cecd1a3531c0b041e29ba46e1\``);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`auth_identities\` CHANGE \`user_id\` \`user_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`auth_identities\` CHANGE \`password_reset_valid_until\` \`password_reset_valid_until\` datetime NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`auth_identities\` CHANGE \`password_reset_token\` \`password_reset_token\` varchar(500) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`auth_identities\` CHANGE \`email_verification_valid_until\` \`email_verification_valid_until\` datetime NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`auth_identities\` CHANGE \`email_verification_token\` \`email_verification_token\` varchar(500) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`auth_identities\` CHANGE \`refresh_token\` \`refresh_token\` varchar(500) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`auth_identities\` ADD CONSTRAINT \`FK_c06a980d83c42611d27a294e55c\` FOREIGN KEY (\`user_id\`) REFERENCES \`nemo_dev\`.\`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`users\` CHANGE \`role_id\` \`role_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`users\` ADD CONSTRAINT \`FK_a2cecd1a3531c0b041e29ba46e1\` FOREIGN KEY (\`role_id\`) REFERENCES \`nemo_dev\`.\`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP TABLE \`nemo_dev\`.\`category\``);
    }

}
