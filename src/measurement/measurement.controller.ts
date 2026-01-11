import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateMeasurementDto } from './dto/create-measurement.dto';
import { MeasurementsFilter } from './dto/query.dto';
import { MeasurementsService } from './measurement.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('measurements')
export class MeasurementsController {
  constructor(private readonly measurementsService: MeasurementsService) {}

  @Post()
  create(@Body() createCategoryDto: CreateMeasurementDto) {
    return this.measurementsService.create(createCategoryDto);
  }

  @Get()
  findAll(@Query() query: MeasurementsFilter) {
    return this.measurementsService.findAll(query);
  }

  @Get('filter')
  findAllFilter(@Query() query: MeasurementsFilter) {
    return this.measurementsService.findAllFilter(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.measurementsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: CreateMeasurementDto,
  ) {
    return this.measurementsService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.measurementsService.remove(id);
  }
}
