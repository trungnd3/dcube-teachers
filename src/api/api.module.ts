import { Module } from '@nestjs/common';
import { TeachersModule } from '@src/teachers/teachers.module';
import { TeachersService } from '@src/teachers/teachers.service';
import { ApiController } from './api.controller';
import { StudentsModule } from '@src/students/students.module';
import { StudentsService } from '@src/students/students.service';
import { ApiService } from './api.service';

@Module({
  imports: [TeachersModule, StudentsModule],
  controllers: [ApiController],
  providers: [TeachersService, StudentsService, ApiService],
})
export class ApiModule {}
