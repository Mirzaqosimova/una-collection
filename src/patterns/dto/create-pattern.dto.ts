import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  image: string;
}
