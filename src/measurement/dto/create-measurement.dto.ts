import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { ProductType } from 'src/common/types/enums';

export class CreateMeasurementDto {
  @ApiProperty()
  @IsString()
  name_uz: string;

  @ApiProperty()
  @IsString()
  name_ru: string;

  @ApiProperty()
  @IsString()
  name_en: string;

  @ApiProperty({ enum: ProductType })
  @IsEnum(ProductType)
  product_type: ProductType;
}
