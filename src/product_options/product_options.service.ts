import { Injectable } from '@nestjs/common';
import { CreateProductOptionDto } from './dto/create-product_option.dto';
import { ProductOptionsRepository } from 'src/repositories/product_options';
import { ProductOptionsFilter } from './dto/query.dto';

@Injectable()
export class ProductOptionsService {
  constructor(
    private readonly productOptionsRepository: ProductOptionsRepository,
  ) {}
  async create(payload: CreateProductOptionDto) {
    const hasDuplicateProduct = await this.productOptionsRepository.findBy({
      product_id: payload.product_id,
      main_color_id: payload.main_color_id,
      decor_color_id: payload.decor_color_id,
    });

    if (hasDuplicateProduct) {
      throw new Error('Duplicate product options');
    }

    return this.productOptionsRepository.create(payload);
  }

  findAll(query: ProductOptionsFilter) {
    return this.productOptionsRepository.findAll(query);
  }

  findOne(id: number) {
    return this.productOptionsRepository.findBy({ id });
  }

  async update(id: number, updateProductOptionDto: CreateProductOptionDto) {
    const hasDuplicateProduct = await this.productOptionsRepository.findBy({
      product_id: updateProductOptionDto.product_id,
      main_color_id: updateProductOptionDto.main_color_id,
      decor_color_id: updateProductOptionDto.decor_color_id,
    });

    if (hasDuplicateProduct) {
      throw new Error('Duplicate product options');
    }

    return this.productOptionsRepository.update({ id }, updateProductOptionDto);
  }

  remove(id: number) {
    return `This action removes a #${id} productOption`;
  }
}
