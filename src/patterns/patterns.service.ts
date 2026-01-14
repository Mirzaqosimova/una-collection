import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePatternDto } from './dto/create-pattern.dto';
import { PatternsRepository } from 'src/repositories/patterns';
import { ProductOptionsRepository } from 'src/repositories/product_options';
import { PatternFilter } from './dto/query.dto';

@Injectable()
export class PatternsService {
  constructor(
    private readonly patternRepository: PatternsRepository,
    private readonly productsOptionsRepository: ProductOptionsRepository,
  ) {}
  async create(createColorDto: CreatePatternDto) {
    const hasCode = await this.patternRepository.findBy({
      name_uz: createColorDto.name_uz,
    });
    createColorDto.name_uz = createColorDto.name_uz
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/['‘’`]/g, "'");
    if (hasCode) {
      throw new ConflictException('Color already exists');
    }
    return this.patternRepository.create(createColorDto);
  }

  findAll(query: PatternFilter) {
    return this.patternRepository.find(query);
  }

  findOne(id: number) {
    return this.patternRepository.findBy({ id });
  }

  async update(id: number, updateColorDto: CreatePatternDto) {
    const hasCode = await this.patternRepository.findBy({
      name_uz: updateColorDto.name_uz,
    });

    if (hasCode && hasCode.id !== id) {
      throw new ConflictException('Color already exists');
    }

    updateColorDto.name_uz = updateColorDto.name_uz
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/['‘’`]/g, "'");
    return this.patternRepository.update({ id }, updateColorDto);
  }

  async remove(id: number) {
    const hasColor = await this.patternRepository.findBy({
      id,
    });
    if (!hasColor) {
      throw new NotFoundException('Color not found');
    }

    const hasProduct = await this.productsOptionsRepository.findBy({
      pattern_id: id,
    });

    if (hasProduct) {
      throw new ConflictException('Color has products');
    }
    return this.patternRepository.delete({ id });
  }

  findAllFilter(query: PatternFilter) {
    return this.patternRepository.findAllFilter(query);
  }
}
