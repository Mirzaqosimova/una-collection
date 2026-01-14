import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { BaseFilter } from 'src/common/dto/base-filter';
import { PatternType } from 'src/common/types/enums';

export class PatternFilter extends BaseFilter {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  type: PatternType;
}
