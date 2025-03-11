import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ApiController } from './api/api.controller';
import { ApiService } from './api/api.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ApiController],
  providers: [ApiService],
})
export class AppModule {}
