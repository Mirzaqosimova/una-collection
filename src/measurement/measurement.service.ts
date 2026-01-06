import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { MeasurementsFilter } from './dto/query.dto';
import { MeasurementsRepository } from 'src/repositories/measurement';
import { ProductsRepository } from 'src/repositories/products';
import { ProductOptionsRepository } from 'src/repositories/product_options';

@Injectable()
export class MeasurementsService {
  constructor(
    private readonly measurementsRepository: MeasurementsRepository,
    private readonly productsOptionsRepository: ProductOptionsRepository,
  ) {}

  async create(payload: CreateCategoryDto) {
    payload.name_uz = payload.name_uz
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/['‘’`]/g, "'");

    const hasCategory = await this.measurementsRepository.findBy({
      name_uz: payload.name_uz,
    });

    if (hasCategory) {
      throw new ConflictException('Category already exists');
    }

    return this.measurementsRepository.create(payload);
  }

  findAll(query: MeasurementsFilter) {
    return this.measurementsRepository.find(query);
  }

  findOne(id: number) {
    return this.measurementsRepository.findBy({ id });
  }

  async update(id: number, payload: CreateCategoryDto) {
    payload.name_uz = payload.name_uz
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/['‘’`]/g, "'");

    const hasDuplicate = await this.measurementsRepository.findBy({
      name_uz: payload.name_uz,
    });

    if (hasDuplicate && hasDuplicate.id !== id) {
      throw new ConflictException('Category already exists');
    }
    return this.measurementsRepository.update({ id }, payload);
  }

  async remove(id: number) {
    const hasProducts = await this.productsOptionsRepository.findBy({
      measurement_id: id,
    });

    if (hasProducts) {
      throw new UnprocessableEntityException('Category has products');
    }
    return this.measurementsRepository.delete({ id });
  }
}
