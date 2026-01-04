import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { BaseFilter } from 'src/common/dto/base-filter';
import { ProductType, ColorType } from 'src/common/types/enums';

export class ColorsFilter extends BaseFilter {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  type: ColorType;
}
