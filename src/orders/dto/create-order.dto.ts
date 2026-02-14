import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEnum,
  ValidateNested,
  IsArray,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { DeliveryType, PaymentType } from 'src/common/types/enums';

export class CreateOrderProductDto {
  @ApiProperty()
  @IsNumber()
  product_option_id: number;

  @ApiProperty({ example: 2, required: false })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 25000 })
  @IsNumber()
  price: number;
}
export class CreateOrderDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty()
  @IsEnum(DeliveryType)
  delivery_type: DeliveryType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({ enum: PaymentType })
  @IsEnum(PaymentType)
  payment_type: PaymentType;

  @ApiProperty({
    type: () => [CreateOrderProductDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderProductDto)
  products: CreateOrderProductDto[];

  user_id: number;
}
