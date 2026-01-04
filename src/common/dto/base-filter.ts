import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { offsetDefault, OffsetPaginationDto } from './offset-pagination.dto';
import { ApiProperty } from '@nestjs/swagger';

export class BaseFilter {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  q?: string;

  @ApiProperty({ type: OffsetPaginationDto })
  @Type(() => OffsetPaginationDto)
  @ValidateNested({ each: true })
  page?: OffsetPaginationDto = offsetDefault;
}
