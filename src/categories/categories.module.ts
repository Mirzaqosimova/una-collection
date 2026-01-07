import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { ProductOptionsModule } from 'src/product_options/product_options.module';
import { CategoriesRepository } from 'src/repositories/categories';

@Module({
  imports: [ProductOptionsModule],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesRepository],
})
export class CategoriesModule {}
