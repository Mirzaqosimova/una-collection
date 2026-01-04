import { Injectable } from '@nestjs/common';
import { ProductsRepository } from 'src/repositories/products';
import { ProductOptionsRepository } from 'src/repositories/product_options';
import { CreateProductDto } from './dto/create-products.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly productOptionsRepository: ProductOptionsRepository,
  ) {}

  async create(payload: CreateProductDto) {
    const hasDuplicate = await this.productsRepository.findBy({
      name_uz: payload.name_uz,
    });

    if (hasDuplicate) {
      throw new Error('product already exists');
    }
    return this.productsRepository.create(payload);
  }

  findAll() {
    return this.productsRepository.findUserSide();
  }

  findUserSide() {
    return this.productsRepository.findUserSide();
  }

  async findOneUserSide(id: number) {
    const hasProduct = await this.productsRepository.findBy({ id });

    if (!hasProduct) {
      throw new Error('product not found');
    }

    const productOptions = await this.productOptionsRepository.findAllUserSide({
      product_id: id,
      is_sold: false,
    });
    hasProduct['products'] = productOptions;
    return hasProduct;
  }

  findOne(id: number) {
    return this.productOptionsRepository.findBy({ id });
  }

  async update(id: number, payload: CreateProductDto) {
    const hasDuplicate = await this.productsRepository.findBy({
      name_uz: payload.name_uz,
    });

    if (hasDuplicate && hasDuplicate.id !== id) {
      throw new Error('product already exists');
    }
    return this.productsRepository.update({ id }, payload);
  }

  remove(id: number) {
    return this.productsRepository.delete({ id });
  }
}
