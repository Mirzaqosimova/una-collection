import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentsRepository } from 'src/repositories/comments';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentsAdminFilter } from './dto/query.dto';
import { CommentStatus } from 'src/common/types/enums';

@Injectable()
export class CommentsService {
  constructor(private readonly commentsRepository: CommentsRepository) {}

  create(payload: CreateCommentDto) {
    return this.commentsRepository.create(payload);
  }

  findAllUserSide() {
    return this.commentsRepository.findAllUserSide();
  }

  findAllAdmin(query: CommentsAdminFilter) {
    return this.commentsRepository.findAllAdmin(query);
  }

  async changeStatus(id: number, status: CommentStatus) {
    const comment = await this.commentsRepository.changeStatus(id, status);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }

  async remove(id: number) {
    const deleted = await this.commentsRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException('Comment not found');
    }
    return { success: true };
  }
}
