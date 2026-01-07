import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoriesRepository } from 'src/repositories/categories';
import { ProductOptionsRepository } from 'src/repositories/product_options';
import { CategoriesFilter } from './dto/query.dto';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoriesRepository: CategoriesRepository,
    private readonly productsOptionsRepository: ProductOptionsRepository,
  ) {}

  async create(payload: CreateCategoryDto) {
    payload.name_uz = payload.name_uz
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/['‘’`]/g, "'");

    const hasCategory = await this.categoriesRepository.findBy({
      name_uz: payload.name_uz,
    });

    if (hasCategory) {
      throw new ConflictException('Category already exists');
    }

    return this.categoriesRepository.create(payload);
  }

  findAll(query: CategoriesFilter) {
    return this.categoriesRepository.find(query);
  }

  findOne(id: number) {
    return this.categoriesRepository.findBy({ id });
  }

  async update(id: number, payload: CreateCategoryDto) {
    payload.name_uz = payload.name_uz
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/['‘’`]/g, "'");

    const hasDuplicate = await this.categoriesRepository.findBy({
      name_uz: payload.name_uz,
    });

    if (hasDuplicate && hasDuplicate.id !== id) {
      throw new ConflictException('Category already exists');
    }
    return this.categoriesRepository.update({ id }, payload);
  }

  async remove(id: number) {
    const hasProducts = await this.productsOptionsRepository.findBy({
      measurement_id: id,
    });

    if (hasProducts) {
      throw new UnprocessableEntityException('Category has products');
    }
    return this.categoriesRepository.delete({ id });
  }
}
