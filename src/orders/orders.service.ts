import { ConflictException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ChangeStatusDto } from './dto/update-order.dto';
import { OrdersRepository } from 'src/repositories/orders';
import { OrderStatus } from 'src/common/types/enums';
import { OrdersQueryDto } from './dto/query.dto';
import { PaymentsService } from 'src/payments/payments.service';
import { SendSmsService } from 'src/common/services/sms.service';
import { ORDER_STATUSES } from './dto/const';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly paymentsService: PaymentsService,
    private readonly sendSmsService: SendSmsService,
  ) {}

  async create(payload: CreateOrderDto, user_id: number) {
    const hasUserActiveOrder = await this.ordersRepository.findBy({
      phone: payload.phone,
      status: OrderStatus.NEW,
    });

    if (hasUserActiveOrder) {
      throw new ConflictException('You already have order');
    }

    return this.ordersRepository.create({ user_id, ...payload });
  }

  async findAll(query: OrdersQueryDto) {
    const resp = await this.ordersRepository.findAll(query);
    if (
      query.status &&
      [OrderStatus.NEW, OrderStatus.APPROVED, OrderStatus.ON_DELIVERY].includes(
        query.status,
      ) &&
      resp.entities.length
    ) {
      for (let i = 0; i < resp.entities.length; i++) {
        const element = resp.entities[i];
        if (element.transaction_id && !element.payment_check) {
          const payment_check = await this.paymentsService.generateFiscalLink(
            element.id,
          );
          resp.entities[i]['payment_check'] = payment_check;
        }
      }
    }
    return resp;
  }

  async findOne(id: number) {
    const res = await this.ordersRepository.findByIdAdmin({ id });
    if (res.transaction_id && !res.payment_check) {
      const payment_check = await this.paymentsService.generateFiscalLink(
        res.id,
      );
      res['payment_check'] = payment_check;
    }
    return res;
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
    if (payload.status == OrderStatus.DONE && !hasOrder.payment_check) {
      if (!payload.payment_check)
        throw new ConflictException(
          'You can not change status to DONE without payment check',
        );
    }

    const [res] = await this.ordersRepository.update({ id }, payload);

    await this.sendSmsService.sendSms(
      hasOrder.phone,
      ORDER_STATUSES.find((x) => x.status == payload.status)[
        'message_' + hasOrder.language
      ],
    );

    return res;
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

  findUserOrders(query: OrdersQueryDto, user_id: number) {
    return this.ordersRepository.findAllUser(query, user_id);
  }
}
