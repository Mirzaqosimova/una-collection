import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, ValidateIf } from 'class-validator';

export class OffsetPaginationDto {
  @IsOptional()
  @ApiProperty({ required: false, default: 20 })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  limit?: number = 20;

  @IsOptional()
  @ApiProperty({ required: false, default: 0 })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @ValidateIf((o) => o.offset !== 0)
  offset?: number = 0;
}

export const offsetDefault = new OffsetPaginationDto();
offsetDefault.offset = 0;
offsetDefault.limit = 20;
