import { IsInt } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductOptionDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  photos: string[];

  @ApiProperty()
  @IsInt()
  main_color_id: number;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  decor_color_id: number;

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
}
