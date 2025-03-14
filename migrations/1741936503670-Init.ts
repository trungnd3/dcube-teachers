import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1741936503670 implements MigrationInterface {
    name = 'Init1741936503670'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`student\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`teacher\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`teacher_students_student\` (\`teacherId\` int NOT NULL, \`studentId\` int NOT NULL, INDEX \`IDX_099234f0e507f8d97fbcacd14b\` (\`teacherId\`), INDEX \`IDX_46cf5ac1712979a26645705a0f\` (\`studentId\`), PRIMARY KEY (\`teacherId\`, \`studentId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`teacher_students_student\` ADD CONSTRAINT \`FK_099234f0e507f8d97fbcacd14b3\` FOREIGN KEY (\`teacherId\`) REFERENCES \`teacher\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`teacher_students_student\` ADD CONSTRAINT \`FK_46cf5ac1712979a26645705a0f1\` FOREIGN KEY (\`studentId\`) REFERENCES \`student\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`teacher_students_student\` DROP FOREIGN KEY \`FK_46cf5ac1712979a26645705a0f1\``);
        await queryRunner.query(`ALTER TABLE \`teacher_students_student\` DROP FOREIGN KEY \`FK_099234f0e507f8d97fbcacd14b3\``);
        await queryRunner.query(`DROP INDEX \`IDX_46cf5ac1712979a26645705a0f\` ON \`teacher_students_student\``);
        await queryRunner.query(`DROP INDEX \`IDX_099234f0e507f8d97fbcacd14b\` ON \`teacher_students_student\``);
        await queryRunner.query(`DROP TABLE \`teacher_students_student\``);
        await queryRunner.query(`DROP TABLE \`teacher\``);
        await queryRunner.query(`DROP TABLE \`student\``);
    }

}
