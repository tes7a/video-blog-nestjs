import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { Response } from 'express';

import { CommentsRepository } from '../infrastructure';

@Controller('/comments')
export class CommentsController {
  constructor(private commentsRepository: CommentsRepository) {}

  @Get('/:id')
  async getCommentById(@Param('id') id: string, @Res() response: Response) {
    const data = await this.commentsRepository.geCommentById(id);
    if (!data) return response.sendStatus(HttpStatus.NOT_FOUND);
    return response.status(HttpStatus.OK).send(data);
  }
}
