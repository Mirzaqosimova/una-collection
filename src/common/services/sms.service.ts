import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectKnex, Knex } from 'nestjs-knex';
import { AxiosResponse } from 'axios';

@Injectable()
export class SendSmsService {
  constructor(
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
    @InjectKnex() private readonly knex: Knex,
  ) {}

  async generate_token(hasToken: boolean = false) {
    const resp: AxiosResponse = await this.httpService.axiosRef.post(
      this.config.get('SMS_LOGIN_URL'),
      {
        email: this.config.get('SMS_EMAIL'),
        password: this.config.get('SMS_PASSWORD'),
      },
    );
    const token = resp.data['data']['token'];

    if (!token) {
      throw new BadRequestException('Eskiz token not found');
    }
    if (hasToken) {
      await this.knex('tokens').update({
        token,
      });
    } else {
      await this.knex('tokens').insert({
        token,
      });
    }

    return { token };
  }

  async sendSmsRequest(
    token: string,
    message: string,
    phone: string,
    is_first: boolean,
  ) {
    try {
      await this.httpService.axiosRef.post(
        this.config.get('SMS_SEND_URL'),
        {
          mobile_phone: phone,
          message: message,
          from: 4546,
          callback_url: 'http://0000.uz/test.php',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 15000, // 15 seconds
        },
      );
      console.log('seeend');
    } catch (error) {
      if (error.status == 401 && is_first) {
        const { token: newToken } = await this.generate_token(true);
        await this.sendSmsRequest(newToken, message, phone, false);
        return;
      }
      console.log(error);
      if (error.status !== 401) {
        throw error;
      }
    }
  }

  async sendSms(phone: string, message: string) {
    let data = await this.knex('tokens').select('*').first();
    if (!data) {
      data = await this.generate_token();
    }

    if (phone.startsWith('+')) {
      phone = phone.substring(1);
    }

    await this.sendSmsRequest(data.token, message, phone, true);
    return true;
  }
}
