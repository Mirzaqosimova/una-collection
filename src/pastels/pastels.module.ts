import { Module } from '@nestjs/common';
import { PastelsService } from './pastels.service';
import { PastelsController } from './pastels.controller';

@Module({
  controllers: [PastelsController],
  providers: [PastelsService],
})
export class PastelsModule {}
