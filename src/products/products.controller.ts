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
import { Role } from 'src/common/types/enums';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Roles(Role.ADMIN)
  @Get()
  findAll(@Query() query: ProductsFilter) {
    return this.productsService.findAll(query);
  }

  @Public()
  @Get('/user-side')
  findUserSide(@Query() query: ProductsFilter) {
    return this.productsService.findUserSide(query);
  }

  @Public()
  @Get('/user-side/:id')
  findOneUserSide(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOneUserSide(id);
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: CreateProductDto,
  ) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(+id);
  }
}
