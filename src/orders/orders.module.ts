import { forwardRef, Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrdersRepository } from 'src/repositories/orders';
import { OrderOptionsRepository } from 'src/repositories/order_options';
import { PaymentsModule } from 'src/payments/payments.module';
import { CoreModules } from 'src/common/core.module';

@Module({
  imports: [CoreModules, forwardRef(() => PaymentsModule)],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository, OrderOptionsRepository],
  exports: [OrdersRepository, OrderOptionsRepository],
})
export class OrdersModule {}
