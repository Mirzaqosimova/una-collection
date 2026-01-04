import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PastelOptionsService } from './pastel_options.service';
import { CreatePastelOptionDto } from './dto/create-pastel_option.dto';
import { UpdatePastelOptionDto } from './dto/update-pastel_option.dto';

@Controller('pastel-options')
export class PastelOptionsController {
  constructor(private readonly pastelOptionsService: PastelOptionsService) {}

  @Post()
  create(@Body() createPastelOptionDto: CreatePastelOptionDto) {
    return this.pastelOptionsService.create(createPastelOptionDto);
  }

  @Get()
  findAll() {
    return this.pastelOptionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pastelOptionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePastelOptionDto: UpdatePastelOptionDto) {
    return this.pastelOptionsService.update(+id, updatePastelOptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pastelOptionsService.remove(+id);
  }
}
