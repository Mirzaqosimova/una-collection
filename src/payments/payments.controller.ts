import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Public } from 'src/common/decorators/is-public.decorator';
import { ClickRequestDto } from './dto/interface';

@Public()
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('click')
  async handleMerchantTransactions(@Body() clickReqBody: any) {
    return this.paymentsService.handleMerchantTransactions(clickReqBody);
  }

  // @Post('click-check/:order_id')
  // async generateFiscalLink(@Param('order_id') order_id: number) {
  //   return this.paymentsService.generateFiscalLink(order_id);
  // }

  // @Post('click-get-link/:payment_id')
  // async getLink(@Param('payment_id') payment_id: number) {
  //   return this.paymentsService.getFiscalCheckLink(payment_id);
  // }
}
