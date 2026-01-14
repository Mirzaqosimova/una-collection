import { Module } from '@nestjs/common';
import { PatternsService } from './patterns.service';
import { PatternsController } from './patterns.controller';
import { PatternsRepository } from 'src/repositories/patterns';
import { ProductOptionsModule } from 'src/product_options/product_options.module';

@Module({
  imports: [ProductOptionsModule],
  controllers: [PatternsController],
  providers: [PatternsService, PatternsRepository],
})
export class PatternsModule {}
