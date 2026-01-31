import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from 'src/common/types/enums';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class ChangeStatusDto {
  @ApiProperty({ enum: OrderStatus })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  payment_check?: string;
}
