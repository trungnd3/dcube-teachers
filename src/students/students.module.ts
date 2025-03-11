import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { DatabaseModule } from 'src/database/database.module';
import { studentProviders } from './student.providers';

@Module({
  imports: [DatabaseModule],
  providers: [...studentProviders, StudentsService],
  exports: [...studentProviders, StudentsService],
})
export class StudentsModule {}
