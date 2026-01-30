import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { BaseFilter } from 'src/common/dto/base-filter';
import { DeliveryType, OrderStatus } from 'src/common/types/enums';

export class OrdersQueryDto extends BaseFilter {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
