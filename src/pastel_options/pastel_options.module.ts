import { Module } from '@nestjs/common';
import { PastelOptionsService } from './pastel_options.service';
import { PastelOptionsController } from './pastel_options.controller';

@Module({
  controllers: [PastelOptionsController],
  providers: [PastelOptionsService],
})
export class PastelOptionsModule {}
