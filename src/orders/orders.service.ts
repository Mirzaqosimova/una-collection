import { ConflictException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ChangeStatusDto } from './dto/update-order.dto';
import { OrdersRepository } from 'src/repositories/orders';
import { OrderStatus } from 'src/common/types/enums';
import { OrdersQueryDto } from './dto/query.dto';
import { OrderOptionsRepository } from 'src/repositories/order_options';
import { PaymentsService } from 'src/payments/payments.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly paymentsService: PaymentsService,
  ) {}

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

  async changeStatus(id: number, payload: ChangeStatusDto) {
    const hasOrder = await this.ordersRepository.findByIdAdmin({
      id,
    });
    if (!hasOrder) {
      throw new ConflictException('Order not found');
    }
    if (payload.status == OrderStatus.NEW) {
      throw new ConflictException('You can not change status to NEW');
    }
    if (payload.status == OrderStatus.DONE && !payload.payment_check) {
      throw new ConflictException(
        'You can not change status to DONE without payment check',
      );
    }

    return this.ordersRepository.update({ id }, payload);
  }

  remove(id: number) {
    return this.ordersRepository.remove(id);
  }

  async generatePaymentLink(id: number) {
    const hasOrder = await this.ordersRepository.findBy({ id });

    if (!hasOrder) {
      throw new ConflictException('Order not found');
    }

    return this.paymentsService.generateClickLink(hasOrder);
  }
}
