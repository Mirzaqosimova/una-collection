import { forwardRef, Module } from '@nestjs/common';
import { ProductOptionsService } from './product_options.service';
import { ProductOptionsController } from './product_options.controller';
import { ProductOptionsRepository } from 'src/repositories/product_options';
import { ProductsModule } from 'src/products/products.module';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports: [forwardRef(() => ProductsModule), OrdersModule],
  controllers: [ProductOptionsController],
  providers: [ProductOptionsService, ProductOptionsRepository],
  exports: [ProductOptionsRepository],
})
export class ProductOptionsModule {}
