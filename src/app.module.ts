import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ColorsModule } from './colors/colors.module';
import { OrdersModule } from './orders/orders.module';
import { CoreModules } from './common/core.module';
import { MeasurementsModule } from './measurement/measurement.module';
import { MediaFilesModule } from './media-files/media-files.module';
import { ProductsModule } from './products/products.module';
import { ProductOptionsModule } from './product_options/product_options.module';
import { join } from 'path';
import { cwd } from 'process';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { CategoriesModule } from './categories/categories.module';
import { PatternsModule } from './patterns/patterns.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    ServeStaticModule.forRoot({
      rootPath: join(cwd(), 'uploads', 'files'),
    }),
    AuthModule,
    CoreModules,
    MeasurementsModule,
    ColorsModule,
    ProductsModule,
    ProductOptionsModule,
    OrdersModule,
    MediaFilesModule,
    CategoriesModule,
    PatternsModule,
  ],
})
export class AppModule {}
