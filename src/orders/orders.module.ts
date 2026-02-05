import { forwardRef, Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrdersRepository } from 'src/repositories/orders';
import { OrderOptionsRepository } from 'src/repositories/order_options';
import { PaymentsModule } from 'src/payments/payments.module';

@Module({
  imports: [forwardRef(() => PaymentsModule)],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository, OrderOptionsRepository],
  exports: [OrdersRepository, OrderOptionsRepository],
})
export class OrdersModule {}
