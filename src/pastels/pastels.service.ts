import { Injectable } from '@nestjs/common';
import { CreatePastelDto } from './dto/create-pastel.dto';
import { UpdatePastelDto } from './dto/update-pastel.dto';

@Injectable()
export class PastelsService {
  create(createPastelDto: CreatePastelDto) {
    return 'This action adds a new pastel';
  }

  findAll() {
    return `This action returns all pastels`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pastel`;
  }

  update(id: number, updatePastelDto: UpdatePastelDto) {
    return `This action updates a #${id} pastel`;
  }

  remove(id: number) {
    return `This action removes a #${id} pastel`;
  }
}
