import { Controller, Post, Body, Get } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Public } from 'src/common/decorators/is-public.decorator';

@Public()
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('click')
  async handleMerchantTransactions(@Body() clickReqBody: any) {
    return this.paymentsService.handleMerchantTransactions(clickReqBody);
  }
}
