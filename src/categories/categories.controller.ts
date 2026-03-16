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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ChangeOrderDto } from './dto/change-order.dto';
import { CategoriesFilter } from './dto/query.dto';
import { Public } from 'src/common/decorators/is-public.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/types/enums';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Roles(Role.ADMIN)
  @Get()
  findAll(@Query() query: CategoriesFilter) {
    return this.categoriesService.findAll(query);
  }

  @Get('filter')
  findAllFilter(@Query() query: CategoriesFilter) {
    return this.categoriesService.findAllFilter(query);
  }

  @Public()
  @Get('user-side')
  findAllUser() {
    return this.categoriesService.findAllUserSide();
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @Patch('change-order/:id')
  changeOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ChangeOrderDto,
  ) {
    return this.categoriesService.changeOrder(id, dto);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: CreateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(id);
  }
}
