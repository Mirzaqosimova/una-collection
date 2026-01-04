import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PastelsService } from './pastels.service';
import { CreatePastelDto } from './dto/create-pastel.dto';
import { UpdatePastelDto } from './dto/update-pastel.dto';

@Controller('pastels')
export class PastelsController {
  constructor(private readonly pastelsService: PastelsService) {}

  @Post()
  create(@Body() createPastelDto: CreatePastelDto) {
    return this.pastelsService.create(createPastelDto);
  }

  @Get()
  findAll() {
    return this.pastelsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pastelsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePastelDto: UpdatePastelDto) {
    return this.pastelsService.update(+id, updatePastelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pastelsService.remove(+id);
  }
}
