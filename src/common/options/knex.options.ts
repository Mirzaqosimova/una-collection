import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KnexModuleOptions, KnexModuleOptionsFactory } from 'nestjs-knex';

@Injectable()
export class KnexOptions implements KnexModuleOptionsFactory {
  constructor(private configService: ConfigService) {}

  createKnexModuleOptions(): KnexModuleOptions {
    return {
      config: {
        client: this.configService.get('DB_TYPE'),
        useNullAsDefault: true,
        connection: {
          host: this.configService.get('DB_HOST'),
          user: this.configService.get('DB_USER'),
          password: this.configService.get('DB_PASSWORD'),
          database: this.configService.get('DB_NAME'),
          port: this.configService.get('DB_PORT'),
        },
      },
    };
  }
}
