import { Module } from '@nestjs/common';
import { ColorsService } from './colors.service';
import { ColorsController } from './colors.controller';
import { ColorsRepository } from 'src/repositories/colors';

@Module({
  controllers: [ColorsController],
  providers: [ColorsService, ColorsRepository],
})
export class ColorsModule {}
