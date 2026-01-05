import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNumber, IsString } from 'class-validator';
import { ProductType } from 'src/common/types/enums';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  name_uz: string;

  @ApiProperty()
  @IsString()
  name_ru: string;

  @ApiProperty()
  @IsString()
  name_en: string;

  @ApiProperty()
  @IsInt()
  category_id: number;

  @ApiProperty()
  @IsString()
  description_uz: string;

  @ApiProperty()
  @IsString()
  description_ru: string;

  @ApiProperty()
  @IsString()
  description_en: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty({ enum: ProductType })
  @IsEnum(ProductType)
  type: ProductType;

  slug?: string;
}
