import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { MediaFileAssociations, MediaFileUsages } from 'src/common/types/enums';

export class CreateMediaFileDto {
  @IsEnum(MediaFileAssociations)
  @ApiProperty({ enum: MediaFileAssociations })
  associated_with: MediaFileAssociations;

  @IsEnum(MediaFileUsages)
  @ApiProperty({ enum: MediaFileUsages })
  usage: MediaFileUsages;

  @ApiProperty({
    name: 'file',
    type: 'string',
    format: 'binary',
  })
  file: any;

  filename: string;
}

export class DeleteMediaDto {
  @ApiProperty()
  @IsString({ each: true })
  path: string[];
}
