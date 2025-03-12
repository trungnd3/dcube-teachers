import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ApiService } from './api/api.service';
import { ApiModule } from './api/api.module';
import { TeachersModule } from './teachers/teachers.module';
import { StudentsModule } from './students/students.module';

@Module({
  imports: [DatabaseModule, ApiModule, TeachersModule, StudentsModule],
  providers: [ApiService],
})
export class AppModule {}
