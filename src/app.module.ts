import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ColorsModule } from './colors/colors.module';
import { ProductsModule } from './products/products.module';
import { ProductOptionsModule } from './product_options/product_options.module';
import { PastelsModule } from './pastels/pastels.module';
import { PastelOptionsModule } from './pastel_options/pastel_options.module';
import { OrdersModule } from './orders/orders.module';
import { CoreModules } from './common/core.module';
import { MeasurementsModule } from './measurement/measurement.module';

@Module({
  imports: [
    AuthModule,
    CoreModules,
    MeasurementsModule,
    ColorsModule,
    ProductsModule,
    ProductOptionsModule,
    PastelsModule,
    PastelOptionsModule,
    OrdersModule,
  ],
})
export class AppModule {}
