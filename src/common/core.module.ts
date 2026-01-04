import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KnexModule } from 'nestjs-knex';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { cwd } from 'process';
import * as dotenv from 'dotenv';
import { TransactionsService } from './services/transactions';
import { KnexOptions } from './options/knex.options';

dotenv.config();

@Module({
  imports: [
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
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class CoreModules {}
