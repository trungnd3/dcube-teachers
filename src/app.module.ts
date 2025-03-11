import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ApiController } from './api/api.controller';
import { ApiService } from './api/api.service';
import { TeachersModule } from './teachers/teachers.module';
import { StudentsService } from './students/students.service';
import { StudentsModule } from './students/students.module';
import { TeachersService } from './teachers/teachers.service';

@Module({
  imports: [DatabaseModule, TeachersModule, StudentsModule],
  controllers: [ApiController],
  providers: [ApiService, TeachersService, StudentsService],
})
export class AppModule {}
