import { Module } from '@nestjs/common';
import { ApiService } from './api/api.service';
import { ApiModule } from './api/api.module';
import { TeachersModule } from './teachers/teachers.module';
import { StudentsModule } from './students/students.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './data-source';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    ApiModule,
    TeachersModule,
    StudentsModule,
  ],
  providers: [ApiService],
})
export class AppModule {}
