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
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/types/enums';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from 'src/common/dto/currentUserI';
import { CurrentUser } from 'src/common/decorators/current-user';

@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Roles(Role.USER)
  @Post()
  create(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser('id') user_id: number,
  ) {
    return this.ordersService.create(createOrderDto, user_id);
  }

  @Roles(Role.ADMIN)
  @Get()
  findAll(@Query() query: OrdersQueryDto) {
    return this.ordersService.findAll(query);
  }

  @Roles(Role.USER)
  @Get('user-side')
  findUserOrders(
    @Query() query: OrdersQueryDto,
    @CurrentUser('id') user_id: number,
  ) {
    return this.ordersService.findUserOrders(query, user_id);
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
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
