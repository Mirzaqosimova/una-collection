import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';
import { BaseFilter } from 'src/common/dto/base-filter';
import { ProductType } from 'src/common/types/enums';

export class ProductsFilter extends BaseFilter {
  @ApiProperty({ required: false })
  @IsNumberString()
  @IsOptional()
  category_id: number;

  @ApiProperty({ required: false })
  @IsNumberString()
  @IsOptional()
  measurement_id: number;

  @ApiProperty({ required: false })
  @IsNumberString()
  @IsOptional()
  color_id: number;
}
