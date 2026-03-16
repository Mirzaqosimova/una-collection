import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class ChangeOrderDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  to_order: number;
}
