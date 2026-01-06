import { Type } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { offsetDefault, OffsetPaginationDto } from './offset-pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import { LangEnum } from '../types/enums';

export class BaseFilter {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  q?: string;

  @ApiProperty({ required: false, enum: LangEnum })
  @IsOptional()
  @IsEnum(LangEnum)
  lang?: LangEnum = LangEnum.UZ;

  @ApiProperty({ type: OffsetPaginationDto })
  @Type(() => OffsetPaginationDto)
  @ValidateNested({ each: true })
  page?: OffsetPaginationDto = offsetDefault;
}
