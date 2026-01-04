import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { MeasurementsFilter } from './dto/query.dto';
import { MeasurementsRepository } from 'src/repositories/measurement';

@Injectable()
export class MeasurementsService {
  constructor(
    private readonly measurementsRepository: MeasurementsRepository,
  ) {}

  async create(payload: CreateCategoryDto) {
    const hasCategory = await this.measurementsRepository.findBy({
      name: payload.name_uz,
    });

    if (hasCategory) {
      throw new Error('Category already exists');
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
    const hasDuplicate = await this.measurementsRepository.findBy({
      name: payload.name_uz,
    });

    if (hasDuplicate && hasDuplicate.id !== id) {
      throw new Error('Category already exists');
    }
    return this.measurementsRepository.update({ id }, payload);
  }

  remove(id: number) {
    return this.measurementsRepository.delete({ id });
  }
}
