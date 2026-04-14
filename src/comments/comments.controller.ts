import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/is-public.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/types/enums';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ChangeStatusDto } from './dto/change-status.dto';
import { CommentsAdminFilter } from './dto/query.dto';

@ApiBearerAuth()
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Public()
  @Post()
  create(@Body() dto: CreateCommentDto) {
    return this.commentsService.create(dto);
  }

  @Public()
  @Get('user-side')
  findUserSide(@Query() query: CommentsAdminFilter) {
    return this.commentsService.findAllUserSide(query);
  }

  @Roles(Role.ADMIN)
  @Get()
  findAll(@Query() query: CommentsAdminFilter) {
    return this.commentsService.findAllAdmin(query);
  }

  @Roles(Role.ADMIN)
  @Patch('change-status/:id')
  changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ChangeStatusDto,
  ) {
    return this.commentsService.changeStatus(id, dto.status);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.remove(id);
  }
}
