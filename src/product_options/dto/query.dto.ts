import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';
import { BaseFilter } from 'src/common/dto/base-filter';

export class ProductOptionsFilter extends BaseFilter {
  @ApiProperty({ required: false })
  @IsNumberString()
  @IsOptional()
  product_id: number;
}

export class ProductOptionsExistsFilter {
  @ApiProperty({ required: false })
  @IsNumberString()
  product_id: number;

  @ApiProperty({ required: false })
  @IsNumberString()
  @IsOptional()
  measurement_id: number;

  @ApiProperty({ required: false })
  @IsNumberString()
  main_color_id: number;

  @ApiProperty({ required: false })
  @IsNumberString()
  @IsOptional()
  pattern_id: number;
}
