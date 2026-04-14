import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { BaseFilter } from 'src/common/dto/base-filter';
import { CommentStatus } from 'src/common/types/enums';

export class CommentsAdminFilter extends BaseFilter {
  @ApiProperty({ enum: CommentStatus, required: false })
  @IsEnum(CommentStatus)
  @IsOptional()
  status?: CommentStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  product_id: number;
}
