import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductOptionDto } from './dto/create-product_option.dto';
import { ChangeOrderDto } from './dto/change-order.dto';
import { ProductOptionsRepository } from 'src/repositories/product_options';
import {
  ProductOptionsExistsFilter,
  ProductOptionsFilter,
} from './dto/query.dto';
import { ProductsRepository } from 'src/repositories/products';
import { ProductType } from 'src/common/types/enums';
import { OrdersRepository } from 'src/repositories/orders';
import { OrderOptionsRepository } from 'src/repositories/order_options';

@Injectable()
export class ProductOptionsService {
  constructor(
    private readonly productOptionsRepository: ProductOptionsRepository,
    private readonly productsRepository: ProductsRepository,
    private readonly orderOptionsRepository: OrderOptionsRepository,
  ) {}

  async create(payload: CreateProductOptionDto) {
    const hasProduct = await this.productsRepository.findBy({
      id: payload.product_id,
    });

    if (!hasProduct) {
      throw new NotFoundException('Product not found');
    }
    const validation = {
      product_id: payload.product_id,
      main_color_id: payload.main_color_id,
    };

    if (hasProduct.type === ProductType.CLOTHES) {
      validation['pattern_id'] = payload.pattern_id;
    } else {
      validation['measurement_id'] = payload.measurement_id;
    }

    const hasDuplicateProduct =
      await this.productOptionsRepository.findBy(validation);

    if (hasDuplicateProduct) {
      throw new ConflictException('Duplicate product options');
    }

    return this.productOptionsRepository.create(payload);
  }

  findAll(query: ProductOptionsFilter) {
    return this.productOptionsRepository.findAll(query);
  }

  findOne(id: number) {
    return this.productOptionsRepository.findBy({ id });
  }

  async update(id: number, payload: CreateProductOptionDto) {
    const hasProduct = await this.productsRepository.findBy({
      id: payload.product_id,
    });

    if (!hasProduct) {
      throw new NotFoundException('Product not found');
    }
    const validation = {
      product_id: payload.product_id,
      main_color_id: payload.main_color_id,
    };

    if (hasProduct.type === ProductType.CLOTHES) {
      validation['pattern_id'] = payload.pattern_id;
    } else {
      if (payload.quantity < Number(hasProduct.quantity)) {
        throw new ConflictException('Not enough quantity');
      }
      validation['measurement_id'] = payload.measurement_id;
    }

    const hasDuplicateProduct =
      await this.productOptionsRepository.findBy(validation);

    if (hasDuplicateProduct && hasDuplicateProduct.id !== id) {
      throw new ConflictException('Duplicate product options');
    }

    return this.productOptionsRepository.update({ id }, payload);
  }

  changeOrder(id: number, dto: ChangeOrderDto) {
    return this.productOptionsRepository.changeOrder(id, dto.to_order);
  }

  async remove(id: number) {
    const hasOrder = await this.orderOptionsRepository.findWithOrder({
      product_option_id: id,
    });

    if (hasOrder) {
      throw new ConflictException('Product has orders');
    }
    return this.productOptionsRepository.remove({ id });
  }

  async checkExists(query: ProductOptionsExistsFilter) {
    const filter = {
      product_id: query.product_id,
      main_color_id: query.main_color_id,
    };

    if (query.pattern_id) {
      filter['pattern_id'] = query.pattern_id;
    }
    if (query.measurement_id) {
      filter['measurement_id'] = query.measurement_id;
    }
    const hasDuplicateProduct =
      await this.productOptionsRepository.findBy(filter);
    return !!hasDuplicateProduct;
  }
}
