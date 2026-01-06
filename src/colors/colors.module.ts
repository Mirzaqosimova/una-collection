import { Module } from '@nestjs/common';
import { ColorsService } from './colors.service';
import { ColorsController } from './colors.controller';
import { ColorsRepository } from 'src/repositories/colors';
import { ProductOptionsModule } from 'src/product_options/product_options.module';

@Module({
  imports: [ProductOptionsModule],
  controllers: [ColorsController],
  providers: [ColorsService, ColorsRepository],
})
export class ColorsModule {}
