import { IsInt } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductOptionDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  photos: string[];

  @ApiProperty()
  @IsInt()
  @IsOptional()
  main_color_id: number;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  pattern_id: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  article: string;

  @ApiProperty()
  @IsInt()
  measurement_id: number;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  quantity: number;

  @ApiProperty()
  @IsInt()
  product_id: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  price: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description_uz: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description_ru: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description_en: string;
}
