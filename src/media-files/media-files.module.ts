import { Module } from '@nestjs/common';
import { MediaFilesService } from './media-files.service';
import { MediaFilesController } from './media-files.controller';

@Module({
  controllers: [MediaFilesController],
  providers: [MediaFilesService],
})
export class MediaFilesModule {}
