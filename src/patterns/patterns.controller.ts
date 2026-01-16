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
import { PatternsService } from './patterns.service';
import { CreatePatternDto } from './dto/create-pattern.dto';
import { PatternFilter } from './dto/query.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/is-public.decorator';

@ApiTags('Patterns')
@ApiBearerAuth()
@Controller('patterns')
export class PatternsController {
  constructor(private readonly patternsService: PatternsService) {}

  @Post()
  create(@Body() createPatternDto: CreatePatternDto) {
    return this.patternsService.create(createPatternDto);
  }

  @Get()
  findAll(@Query() query: PatternFilter) {
    return this.patternsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.patternsService.findOne(+id);
  }

  @Get('filter')
  findAllFilter(@Query() query: PatternFilter) {
    return this.patternsService.findAllFilter(query);
  }
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePatternDto: CreatePatternDto,
  ) {
    return this.patternsService.update(+id, updatePatternDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.patternsService.remove(+id);
  }
}
