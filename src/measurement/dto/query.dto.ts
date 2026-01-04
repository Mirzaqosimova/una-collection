import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { BaseFilter } from 'src/common/dto/base-filter';
import { ProductType } from 'src/common/types/enums';

export class MeasurementsFilter extends BaseFilter {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  product_type: ProductType;
}
