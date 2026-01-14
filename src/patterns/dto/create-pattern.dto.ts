import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { PatternType } from 'src/common/types/enums';

export class CreatePatternDto {
  @ApiProperty()
  @IsString()
  name_uz: string;

  @ApiProperty()
  @IsString()
  name_ru: string;

  @ApiProperty()
  @IsString()
  name_en: string;

  @ApiProperty()
  @IsEnum(PatternType)
  type: PatternType;

  @ApiProperty()
  @Optional()
  @IsString()
  color: string;

  @ApiProperty()
  @Optional()
  @IsString()
  image: string;
}
