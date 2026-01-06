import { Module } from '@nestjs/common';
import { MeasurementsController } from './measurement.controller';
import { MeasurementsService } from './measurement.service';
import { MeasurementsRepository } from 'src/repositories/measurement';
import { ProductsModule } from 'src/products/products.module';
import { ProductOptionsModule } from 'src/product_options/product_options.module';

@Module({
  imports: [ProductOptionsModule],
  controllers: [MeasurementsController],
  providers: [MeasurementsService, MeasurementsRepository],
})
export class MeasurementsModule {}
