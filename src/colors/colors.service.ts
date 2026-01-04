import { ConflictException, Injectable } from '@nestjs/common';
import { CreateColorDto } from './dto/create-color.dto';
import { ColorsRepository } from 'src/repositories/colors';
import { ColorsFilter } from './dto/query.dto';

@Injectable()
export class ColorsService {
  constructor(private readonly colorsRepository: ColorsRepository) {}
  async create(createColorDto: CreateColorDto) {
    const hasCode = await this.colorsRepository.findBy({
      code: createColorDto.code,
    });
    if (hasCode) {
      throw new ConflictException('Color already exists');
    }
    return this.colorsRepository.create(createColorDto);
  }

  findAll(query: ColorsFilter) {
    return this.colorsRepository.find(query);
  }

  findOne(id: number) {
    return `This action returns a #${id} color`;
  }

  async update(id: number, updateColorDto: CreateColorDto) {
    const hasCode = await this.colorsRepository.findBy({
      code: updateColorDto.code,
    });

    if (hasCode && hasCode.id !== id) {
      throw new ConflictException('Color already exists');
    }
    return this.colorsRepository.update({ id }, updateColorDto);
  }

  remove(id: number) {
    return this.colorsRepository.delete({ id });
  }
}
