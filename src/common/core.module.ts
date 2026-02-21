import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KnexModule } from 'nestjs-knex';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { cwd } from 'process';
import * as dotenv from 'dotenv';
import { TransactionsService } from './services/transactions';
import { KnexOptions } from './options/knex.options';
import { HashingService } from './services/hashing';
import { SendSmsService } from './services/sms.service';
import { HttpModule } from '@nestjs/axios';

dotenv.config();

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    KnexModule.forRootAsync({
      useClass: KnexOptions,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(cwd(), 'assets', 'files'),
    }),
  ],
  providers: [TransactionsService, HashingService, SendSmsService],
  exports: [TransactionsService, HashingService, SendSmsService],
})
export class CoreModules {}
