import { Module } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { DatabaseModule } from 'src/database/database.module';
import { teacherProviders } from './teacher.providers';
import { StudentsModule } from 'src/students/students.module';

@Module({
  imports: [DatabaseModule, StudentsModule],
  providers: [...teacherProviders, TeachersService],
  exports: [...teacherProviders, TeachersService],
})
export class TeachersModule {}
