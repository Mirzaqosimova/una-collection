import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductsRepository } from 'src/repositories/products';
import { ProductOptionsRepository } from 'src/repositories/product_options';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository, ProductOptionsRepository],
})
export class ProductsModule {}
