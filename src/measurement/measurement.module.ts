import { Module } from '@nestjs/common';
import { MeasurementsController } from './measurement.controller';
import { MeasurementsService } from './measurement.service';
import { MeasurementsRepository } from 'src/repositories/measurement';

@Module({
  controllers: [MeasurementsController],
  providers: [MeasurementsService, MeasurementsRepository],
})
export class MeasurementsModule {}
