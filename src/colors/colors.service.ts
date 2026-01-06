import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateColorDto } from './dto/create-color.dto';
import { ColorsRepository } from 'src/repositories/colors';
import { ColorsFilter } from './dto/query.dto';
import { ProductOptionsRepository } from 'src/repositories/product_options';
import { ColorType } from 'src/common/types/enums';

@Injectable()
export class ColorsService {
  constructor(
    private readonly colorsRepository: ColorsRepository,
    private readonly productsOptionsRepository: ProductOptionsRepository,
  ) {}
  async create(createColorDto: CreateColorDto) {
    const hasCode = await this.colorsRepository.findBy({
      code: createColorDto.code,
    });
    createColorDto.name_uz = createColorDto.name_uz
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/['‘’`]/g, "'");
    if (hasCode) {
      throw new ConflictException('Color already exists');
    }
    return this.colorsRepository.create(createColorDto);
  }

  findAll(query: ColorsFilter) {
    return this.colorsRepository.find(query);
  }

  findOne(id: number) {
    return this.colorsRepository.findBy({ id });
  }

  async update(id: number, updateColorDto: CreateColorDto) {
    const hasCode = await this.colorsRepository.findBy({
      code: updateColorDto.code,
    });

    if (hasCode && hasCode.id !== id) {
      throw new ConflictException('Color already exists');
    }

    updateColorDto.name_uz = updateColorDto.name_uz
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/['‘’`]/g, "'");
    return this.colorsRepository.update({ id }, updateColorDto);
  }

  async remove(id: number) {
    const hasColor = await this.colorsRepository.findBy({
      id,
    });
    if (!hasColor) {
      throw new NotFoundException('Color not found');
    }

    let query = {};
    if (hasColor.type == ColorType.DECOR) {
      query = {
        decor_color_id: id,
      };
    } else {
      query = {
        main_color_id: id,
      };
    }
    const hasProduct = await this.productsOptionsRepository.findBy(query);

    if (hasProduct) {
      throw new ConflictException('Color has products');
    }
    return this.colorsRepository.delete({ id });
  }
}
