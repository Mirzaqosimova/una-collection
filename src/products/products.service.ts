import { ConflictException, Injectable } from '@nestjs/common';
import { ProductsRepository } from 'src/repositories/products';
import { ProductOptionsRepository } from 'src/repositories/product_options';
import { CreateProductDto } from './dto/create-products.dto';
import slug from 'slug';
import { ProductType } from 'src/common/types/enums';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly productOptionsRepository: ProductOptionsRepository,
  ) {}

  async create(payload: CreateProductDto) {
    payload.name_uz = payload.name_uz
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/['‘’`]/g, "'");

    const hasDuplicate = await this.productsRepository.findBy({
      name_uz: payload.name_uz,
    });

    if (hasDuplicate) {
      throw new ConflictException('product already exists');
    }
    const slugName = slug(`${payload.name_uz}`, {
      lower: true,
    });
    return this.productsRepository.create({ ...payload, slug: slugName });
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
      throw new ConflictException('product not found');
    }

    if (hasProduct.type === ProductType.CLOTHES) {
      const productOptions =
        await this.productOptionsRepository.findAllUserSide({
          product_id: id,
          is_sold: false,
        });
      hasProduct['products'] = productOptions;
    }

    return hasProduct;
  }

  findOne(id: number) {
    return this.productOptionsRepository.findBy({ id });
  }

  async update(id: number, payload: CreateProductDto) {
    payload.name_uz = payload.name_uz
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/['‘’`]/g, "'");

    const hasDuplicate = await this.productsRepository.findBy({
      name_uz: payload.name_uz,
    });

    if (hasDuplicate && hasDuplicate.id !== id) {
      throw new ConflictException('product already exists');
    }

    const slugName = slug(`${payload.name_uz}`, {
      lower: true,
    });
    return this.productsRepository.update(
      { id },
      { ...payload, slug: slugName },
    );
  }

  remove(id: number) {
    return this.productsRepository.delete({ id });
  }
}
