import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateMediaFileDto } from './create-media-file.dto';
import { IsString } from 'class-validator';

export class UpdateMediaFileDto extends CreateMediaFileDto {
    @ApiProperty()
    @IsString()
    deleted_file_path: string;
}
