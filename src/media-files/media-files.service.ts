import {
  Injectable,
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as path from 'path';
import * as fs from 'fs/promises';
import {
  CreateMediaFileDto,
  DeleteMediaDto,
} from './dto/create-media-file.dto';
import { MediaFileUsages } from 'src/common/types/enums';
import { join } from 'path';
import { cwd } from 'process';
import { promises as fsPromises } from 'fs';
import { UpdateMediaFileDto } from './dto/update-media-file.dto';
import * as sharp from 'sharp';

@Injectable()
export class MediaFilesService {
  async uploadFile(
    file: Express.Multer.File,
    dto: CreateMediaFileDto,
  ): Promise<{ path: string }> {
    try {
      if (!file) {
        throw new UnprocessableEntityException(
          'No file provided or invalid file format.',
        );
      }

      const { usage } = dto;

      const filename = `${randomUUID()}.webp`;

      dto.filename = filename;

      const uploadDir = path.join(process.cwd(), 'uploads/files', usage);

      await fs.mkdir(uploadDir, { recursive: true });

      const filePath = path.join(uploadDir, filename);

      const webpBuffer = await sharp(file.buffer).webp({ quality: 70 }).toBuffer();

      await fs.writeFile(filePath, webpBuffer);

      return {
        path: usage + `/${filename}`,
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteFile(dto: DeleteMediaDto) {
    return dto.path.map(async (path) => {
      const fullPath = join(cwd(), 'uploads', 'files', path);
      try {
        await fsPromises.unlink(fullPath);
        return {
          message: 'deleted',
        };
      } catch (err) {
        return {
          message: 'error',
        };
      }
    });
  }

  async update(file: Express.Multer.File, body: UpdateMediaFileDto) {
    const [res, deleted] = await Promise.all([
      this.uploadFile(file, body),
      this.deleteFile({ path: [body.deleted_file_path] }),
    ]);
    return { ...res, deleted };
  }
}
