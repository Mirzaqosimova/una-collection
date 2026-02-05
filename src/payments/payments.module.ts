import { forwardRef, Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { OrdersModule } from 'src/orders/orders.module';
import { TransactionsRepository } from 'src/repositories/transactions';
import { CoreModules } from 'src/common/core.module';

@Module({
  imports: [forwardRef(() => OrdersModule), CoreModules],
  controllers: [PaymentsController],
  providers: [PaymentsService, TransactionsRepository],
  exports: [PaymentsService],
})
export class PaymentsModule {}
