import { IsInt } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class CreateProductOptionDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  photos: string[];

  @ApiProperty()
  @IsInt()
  main_color_id: number;

  @ApiProperty()
  @IsInt()
  decor_color_id: number;

  @ApiProperty()
  @IsString()
  article: string;

  @ApiProperty()
  @IsInt()
  size_id: number;

  @ApiProperty()
  @IsInt()
  quantity: number;

  @ApiProperty()
  @IsInt()
  product_id: number;
}
