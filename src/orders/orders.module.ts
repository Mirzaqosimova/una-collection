import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrdersRepository } from 'src/repositories/orders';
import { OrderOptionsRepository } from 'src/repositories/order_options';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository, OrderOptionsRepository],
  exports: [OrderOptionsRepository],
})
export class OrdersModule {}
