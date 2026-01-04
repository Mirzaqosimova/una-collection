import { Injectable } from '@nestjs/common';
import { CreatePastelOptionDto } from './dto/create-pastel_option.dto';
import { UpdatePastelOptionDto } from './dto/update-pastel_option.dto';

@Injectable()
export class PastelOptionsService {
  create(createPastelOptionDto: CreatePastelOptionDto) {
    return 'This action adds a new pastelOption';
  }

  findAll() {
    return `This action returns all pastelOptions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pastelOption`;
  }

  update(id: number, updatePastelOptionDto: UpdatePastelOptionDto) {
    return `This action updates a #${id} pastelOption`;
  }

  remove(id: number) {
    return `This action removes a #${id} pastelOption`;
  }
}
