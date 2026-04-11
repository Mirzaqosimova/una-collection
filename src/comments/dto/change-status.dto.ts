import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { CommentStatus } from 'src/common/types/enums';

export class ChangeStatusDto {
  @ApiProperty({ enum: CommentStatus })
  @IsEnum(CommentStatus)
  status: CommentStatus;
}
