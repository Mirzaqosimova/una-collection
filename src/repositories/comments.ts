import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { getResult } from 'src/common/dto/find-all-response';
import { CommentStatus } from 'src/common/types/enums';
import { CreateCommentDto } from 'src/comments/dto/create-comment.dto';
import { CommentsAdminFilter } from 'src/comments/dto/query.dto';

export class CommentsRepository {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  private getBuilder(trx?: Knex.Transaction) {
    return trx ? trx('comments') : this.knex('comments');
  }

  create(payload: CreateCommentDto) {
    return this.getBuilder()
      .insert({ ...payload, status: CommentStatus.PENDING })
      .returning('*')
      .then((res) => res[0]);
  }

  findAllUserSide() {
    return this.getBuilder()
      .where({ status: CommentStatus.ACTIVE })
      .orderBy('created_at', 'desc');
  }

  async findAllAdmin(query: CommentsAdminFilter) {
    const { page, status } = query;
    const bQuery = this.getBuilder().orderBy('created_at', 'desc');

    if (status) {
      bQuery.where({ status });
    }

    const [totalCount] = await bQuery.clone().count('id');

    bQuery.offset(page.offset).limit(page.limit);

    return getResult(
      await bQuery,
      Number(totalCount?.count || 0),
      Number(totalCount?.count || 0) > page.offset + page.limit,
    );
  }

  changeStatus(id: number, status: CommentStatus) {
    return this.getBuilder()
      .where({ id })
      .update({ status })
      .returning('*')
      .then((res) => res[0]);
  }

  delete(id: number) {
    return this.getBuilder().where({ id }).delete();
  }
}
