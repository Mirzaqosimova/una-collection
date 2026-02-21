import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { BaseFilter } from 'src/common/dto/base-filter';
import { DeliveryType, OrderStatus, ProductType } from 'src/common/types/enums';

export class OrdersQueryDto extends BaseFilter {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiProperty({ required: false, enum: ['active', 'all'] })
  @IsOptional()
  @IsEnum(['active', 'all'])
  user_order_filter?: 'active' | 'all';
}
