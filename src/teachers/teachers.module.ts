import { Module } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { StudentsModule } from '@src/students/students.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from './teacher.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Teacher]), StudentsModule],
  providers: [TeachersService],
  exports: [TypeOrmModule, TeachersService],
})
export class TeachersModule {}
