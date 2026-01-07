import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PaymentType } from 'src/common/types/enums';

export class CreateOrderOptionsDto {
  @ApiProperty()
  @IsInt()
  product_option_id: number;

  @ApiProperty()
  @IsInt()
  @Optional()
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  full_name: string;

  @ApiProperty()
  @IsInt()
  delivery_id: number;

  @ApiProperty()
  @IsInt()
  total_price: number;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsNumber()
  longitude: number;

  @ApiProperty()
  @IsNumber()
  latitude: number;

  @ApiProperty({ enum: PaymentType })
  @IsEnum(PaymentType)
  payment_type: PaymentType;

  @ApiProperty({ type: [CreateOrderOptionsDto] })
  @ArrayNotEmpty()
  @IsOptional()
  @IsArray()
  @Type(() => CreateOrderOptionsDto)
  @ValidateNested({ each: true })
  options: CreateOrderOptionsDto[];
}
