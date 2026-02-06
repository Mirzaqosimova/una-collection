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
import { CreateProductOptionDto } from './dto/create-product_option.dto';
import {
  ProductOptionsExistsFilter,
  ProductOptionsFilter,
} from './dto/query.dto';
import { ProductOptionsService } from './product_options.service';
import { Role } from 'src/common/types/enums';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Roles(Role.ADMIN)
@Controller('product-options')
export class ProductOptionsController {
  constructor(private readonly productOptionsService: ProductOptionsService) {}

  @Post()
  create(@Body() payload: CreateProductOptionDto) {
    return this.productOptionsService.create(payload);
  }

  @Get()
  findAll(@Query() query: ProductOptionsFilter) {
    return this.productOptionsService.findAll(query);
  }

  @Get('/check-exists')
  checkExists(@Query() query: ProductOptionsExistsFilter) {
    return this.productOptionsService.checkExists(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productOptionsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: CreateProductOptionDto,
  ) {
    return this.productOptionsService.update(+id, payload);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productOptionsService.remove(+id);
  }
}
