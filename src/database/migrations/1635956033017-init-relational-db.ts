import {MigrationInterface, QueryRunner} from "typeorm";

export class initRelationalDb1635956033017 implements MigrationInterface {
    name = 'initRelationalDb1635956033017'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`nemo_dev\`.\`roles\` (\`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`num\` smallint NOT NULL, \`label\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`nemo_dev\`.\`users\` (\`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(100) NOT NULL, \`password\` varchar(100) NOT NULL, \`firstname\` varchar(50) NOT NULL, \`lastname\` varchar(50) NOT NULL, \`status\` tinyint NOT NULL DEFAULT '0', \`role_id\` int NULL, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`nemo_dev\`.\`auth_identities\` (\`id\` int NOT NULL AUTO_INCREMENT, \`refresh_token\` varchar(500) NULL, \`email_verification_token\` varchar(500) NULL, \`email_verification_valid_until\` datetime NULL, \`password_reset_token\` varchar(500) NULL, \`password_reset_valid_until\` datetime NULL, \`user_id\` int NULL, UNIQUE INDEX \`REL_c06a980d83c42611d27a294e55\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`users\` ADD CONSTRAINT \`FK_a2cecd1a3531c0b041e29ba46e1\` FOREIGN KEY (\`role_id\`) REFERENCES \`nemo_dev\`.\`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`auth_identities\` ADD CONSTRAINT \`FK_c06a980d83c42611d27a294e55c\` FOREIGN KEY (\`user_id\`) REFERENCES \`nemo_dev\`.\`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`auth_identities\` DROP FOREIGN KEY \`FK_c06a980d83c42611d27a294e55c\``);
        await queryRunner.query(`ALTER TABLE \`nemo_dev\`.\`users\` DROP FOREIGN KEY \`FK_a2cecd1a3531c0b041e29ba46e1\``);
        await queryRunner.query(`DROP INDEX \`REL_c06a980d83c42611d27a294e55\` ON \`nemo_dev\`.\`auth_identities\``);
        await queryRunner.query(`DROP TABLE \`nemo_dev\`.\`auth_identities\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`nemo_dev\`.\`users\``);
        await queryRunner.query(`DROP TABLE \`nemo_dev\`.\`users\``);
        await queryRunner.query(`DROP TABLE \`nemo_dev\`.\`roles\``);
    }

}
