import { ConflictException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ChangeStatusDto } from './dto/update-order.dto';
import { OrdersRepository } from 'src/repositories/orders';
import { OrderStatus } from 'src/common/types/enums';
import { OrdersQueryDto } from './dto/query.dto';
import { OrderOptionsRepository } from 'src/repositories/order_options';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async create(payload: CreateOrderDto) {
    const hasUserActiveOrder = await this.ordersRepository.findBy({
      phone: payload.phone,
      status: OrderStatus.NEW,
    });

    if (hasUserActiveOrder) {
      throw new ConflictException('You already have order');
    }

    return this.ordersRepository.create(payload);
  }

  findAll(query: OrdersQueryDto) {
    return this.ordersRepository.findAll(query);
  }

  findOne(id: number) {
    return this.ordersRepository.findByIdAdmin({ id });
  }

  changeStatus(id: number, payload: ChangeStatusDto) {
    if (payload.status!) return this.ordersRepository.update({ id }, payload);
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
