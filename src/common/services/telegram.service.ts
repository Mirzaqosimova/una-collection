import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import * as https from 'https';
import { DeliveryType, PaymentType } from '../types/enums';

const ipv4Agent = new https.Agent({ family: 4 });

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  private async sendWithRetry<T>(
    fn: () => Promise<T>,
    attempts = 3,
  ): Promise<T> {
    for (let i = 0; i < attempts; i++) {
      try {
        return await fn();
      } catch (e) {
        if (i === attempts - 1) throw e;
        await new Promise((r) => setTimeout(r, 2000 * (i + 1)));
      }
    }
  }

  async sendMessage(text: string): Promise<void> {
    const token = this.config.get<string>('BOT_TOKEN');
    const chatId = this.config.get<string>('CHANNEL_ID');

    try {
      await this.sendWithRetry(() =>
        this.httpService.axiosRef.post(
          `https://api.telegram.org/bot${token}/sendMessage`,
          {
            chat_id: chatId,
            text,
            parse_mode: 'HTML',
          },
          {
            httpsAgent: ipv4Agent,
            timeout: 10000,
          },
        ),
      );
    } catch (error) {
      console.log(error);
      this.logger.error('Failed to send Telegram message', error?.message);
      await this.reportError('Telegram sendMessage', error, { text });
    }
  }

  async reportError(
    source: string,
    error: any,
    context?: Record<string, any>,
  ): Promise<void> {
    const token = this.config.get<string>('BOT_TOKEN');
    const chatId = this.config.get<string>('ERROR_SENDER_GROUP_ID');
    const threadId = this.config.get<string>('ERROR_MESSAGE_THREAD_ID');

    if (!chatId) {
      return;
    }

    const lines = [
      `🛑 <b>${source} failed</b>`,
      `<b>Time:</b> ${new Date().toISOString()}`,
    ];
    if (context) {
      lines.push(
        `<b>Context:</b>`,
        `<pre>${JSON.stringify(context, null, 2)}</pre>`,
      );
    }
    lines.push(`<b>Error:</b> ${error?.message ?? String(error)}`);
    if (error?.response?.data) {
      lines.push(
        `<b>Response:</b>`,
        `<pre>${JSON.stringify(error.response.data, null, 2)}</pre>`,
      );
    }

    const text = lines.join('\n').slice(0, 4000);

    try {
      await this.sendWithRetry(() =>
        this.httpService.axiosRef.post(
          `https://api.telegram.org/bot${token}/sendMessage`,
          {
            chat_id: chatId,
            message_thread_id: threadId || undefined,
            text,
            parse_mode: 'HTML',
          },
          {
            httpsAgent: ipv4Agent,
            timeout: 10000,
          },
        ),
      );
    } catch (reportingError) {
      this.logger.error(
        'Failed to report error to Telegram error group',
        reportingError?.message,
      );
    }
  }

  async sendNewOrder(order: {
    id: number;
    full_name: string;
    phone: string;
    delivery_type: string;
    payment_type: string;
    total_price: number;
    address?: string;
    yandex_address?: string;
  }): Promise<void> {
    const deliveryName = {
      [DeliveryType.ONE_DAY]: '24 soat ichida',
      [DeliveryType.ONE_TWO_HOUR]: '1-3 soat ichida',
      [DeliveryType.TWO_FIVE_DAYS]: '2-5 kun ichida',
    };

    const paymentTypeName = {
      [PaymentType.IN_PERSON]: 'Buyurtmani olganda',
    };

    const lines = [
      `🛒 <b>Yangi buyurtma #${order.id}</b>`,
      ``,
      `👤 <b>Ism:</b> ${order.full_name}`,
      `📞 <b>Telefon:</b> ${order.phone}`,
      `🚚 <b>Yetkazib berish:</b> ${deliveryName[order.delivery_type]} `,
      `💳 <b>To'lov turi:</b> ${paymentTypeName[order.payment_type] ?? order.payment_type}`,
      `💰 <b>Jami:</b> ${Number(order.total_price).toLocaleString()} so'm`,
    ];

    if (order.address) {
      lines.push(`📍 <b>Manzil:</b> ${order.address}`);
    }
    if (order.yandex_address) {
      lines.push(`🗺 <b>Yandex manzil:</b> ${order.yandex_address}`);
    }

    await this.sendMessage(lines.join('\n'));
  }
}
