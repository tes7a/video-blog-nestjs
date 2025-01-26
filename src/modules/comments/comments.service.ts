import { Injectable } from '@nestjs/common';

import { CommentsRepository } from './comments.repository';

@Injectable()
export class CommentsService {
  constructor(private commentsRepository: CommentsRepository) {}

  async geCommentById(id: string) {
    return await this.commentsRepository.geCommentById(id);
  }
}
