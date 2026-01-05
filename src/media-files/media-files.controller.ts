import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  Delete,
  Put,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaFilesService } from './media-files.service';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import * as path from 'path';
import {
  CreateMediaFileDto,
  DeleteMediaDto,
} from './dto/create-media-file.dto';
import { UpdateMediaFileDto } from './dto/update-media-file.dto';
import { Public } from 'src/common/decorators/is-public.decorator';

@ApiTags('Media Files')
@Controller('media')
export class MediaFilesController {
  constructor(private readonly mediaFilesService: MediaFilesService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Upload a media file (jpg, jpeg, png, pdf)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateMediaFileDto })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024 }, // 5 MB limit
      fileFilter: (req, file, callback) => {
        const allowedTypes = /jpeg|jpg|png|svg|pdf|pdf|zip|rar|webp/;
        const ext = path
          .extname(file.originalname)
          .toLowerCase()
          .replace('.', '');
        const mimetype = file.mimetype;

        if (allowedTypes.test(ext) && allowedTypes.test(mimetype)) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException(
              'Invalid file format. Allowed formats: jpg, jpeg, png, svg, pdf, zip, rar, webp.',
            ),
            false,
          );
        }
      },
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateMediaFileDto,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided or invalid file format.');
    }
    return this.mediaFilesService.uploadFile(file, body);
  }

  @Put()
  @ApiOperation({ summary: 'Upload a media file (jpg, jpeg, png, pdf)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateMediaFileDto })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
      fileFilter: (req, file, callback) => {
        const allowedTypes = /jpeg|jpg|png|svg|pdf|pdf|zip|rar/;
        const ext = path
          .extname(file.originalname)
          .toLowerCase()
          .replace('.', '');
        const mimetype = file.mimetype;

        if (allowedTypes.test(ext) && allowedTypes.test(mimetype)) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException(
              'Invalid file format. Allowed formats: jpg, jpeg, png, svg, pdf, zip, rar.',
            ),
            false,
          );
        }
      },
    }),
  )
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UpdateMediaFileDto,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided or invalid file format.');
    }
    return this.mediaFilesService.update(file, body);
  }

  @Delete()
  deleteFile(@Body() dto: DeleteMediaDto) {
    return this.mediaFilesService.deleteFile(dto);
  }
}
