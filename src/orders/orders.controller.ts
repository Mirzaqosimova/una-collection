import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  Res,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Public } from 'src/common/decorators/is-public.decorator';
import { OrdersQueryDto } from './dto/query.dto';
import { ChangeStatusDto } from './dto/update-order.dto';
import { Response } from 'express';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Public()
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  findAll(@Query() query: OrdersQueryDto) {
    return this.ordersService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch('change-status/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: ChangeStatusDto,
  ) {
    return this.ordersService.changeStatus(id, updateOrderDto);
  }

  @Public()
  @Get('make-payment/:id')
  async makePayment(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const payment_link = await this.ordersService.generatePaymentLink(id);
    res.header('Content-Type', 'application/json');
    res.status(200).send(payment_link);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.remove(id);
  }
}
