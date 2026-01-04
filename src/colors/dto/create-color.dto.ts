import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { ColorType } from 'src/common/types/enums';

export class CreateColorDto {
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
  @IsString()
  code: string;

  @ApiProperty({ enum: ColorType })
  @IsEnum(ColorType)
  type: ColorType;
}
