import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { Public } from 'src/common/decorators/is-public.decorator';
import { CreateProductDto } from './dto/create-products.dto';
import { ProductsService } from './products.service';
import { ProductsFilter } from './dto/query.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Public()
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(@Query() query: ProductsFilter) {
    return this.productsService.findAll(query);
  }

  @Public()
  @Get('/user-side')
  findUserSide() {
    return this.productsService.findUserSide();
  }

  @Public()
  @Get('/user-side/:id')
  findOneUserSide(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOneUserSide(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: CreateProductDto,
  ) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(+id);
  }
}
