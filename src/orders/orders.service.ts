import { ConflictException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersRepository } from 'src/repositories/orders';
import { OrderStatus } from 'src/common/types/enums';

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

  findAll() {
    return this.ordersRepository.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
