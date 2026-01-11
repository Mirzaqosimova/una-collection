import { ConflictException, Injectable } from '@nestjs/common';
import { ProductsRepository } from 'src/repositories/products';
import { ProductOptionsRepository } from 'src/repositories/product_options';
import { CreateProductDto } from './dto/create-products.dto';
import { ProductType } from 'src/common/types/enums';
import { ProductsFilter } from './dto/query.dto';

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

    const slugName = createSlug(payload.name_uz);
    return this.productsRepository.create({ ...payload, slug: slugName });
  }

  findAll(query: ProductsFilter) {
    return this.productsRepository.findAll(query);
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
    return this.productsRepository.findBy({ id });
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
    const slugName = createSlug(payload.name_uz);
    return this.productsRepository.update(
      { id },
      { ...payload, slug: slugName },
    );
  }

  remove(id: number) {
    return this.productsRepository.delete({ id });
  }
}

export function createSlug(text: string): string {
  return text
    .toString()
    .normalize('NFD') // split accented characters
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // replace spaces with -
    .replace(/-+/g, '-'); // remove multiple -
}
