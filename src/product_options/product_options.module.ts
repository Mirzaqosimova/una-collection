import { Module } from '@nestjs/common';
import { ProductOptionsService } from './product_options.service';
import { ProductOptionsController } from './product_options.controller';
import { ProductOptionsRepository } from 'src/repositories/product_options';

@Module({
  controllers: [ProductOptionsController],
  providers: [ProductOptionsService, ProductOptionsRepository],
  exports: [ProductOptionsRepository],
})
export class ProductOptionsModule {}
