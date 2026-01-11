import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';
import { BaseFilter } from 'src/common/dto/base-filter';

export class ProductOptionsFilter extends BaseFilter {
  @ApiProperty({ required: false })
  @IsNumberString()
  @IsOptional()
  product_id: number;
}
