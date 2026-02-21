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

  async generate_token() {
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

    await this.knex('tokens').insert({
      token,
    });
    return { token };
  }

  async sendSmsRequest(token: string, message: string, phone: string) {
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
        },
      );
    } catch (error) {
      console.log(error);
      throw error;
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

    await this.sendSmsRequest(data.token, message, phone);
    return true;
  }
}
