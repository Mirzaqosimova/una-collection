import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';
import { BaseFilter } from 'src/common/dto/base-filter';
import { ProductType } from 'src/common/types/enums';

export class ProductOptionsFilter extends BaseFilter {
  @ApiProperty({ required: false })
  @IsNumberString()
  @IsOptional()
  product_id: number;
}
