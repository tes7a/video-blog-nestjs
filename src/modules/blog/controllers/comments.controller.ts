import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { CommentsRepository } from '../infrastructure';
import { JwtAuthGuard } from '../../users/guards';
import { CurrentUser } from '../../users/decorators';
import { UserType } from '../../users/models';
import { ContentValidation, LikeStatusValidation } from '../validation';

@Controller('/comments')
export class CommentsController {
  constructor(private commentsRepository: CommentsRepository) {}

  @Get('/:id')
  async getCommentById(@Param('id') id: string, @Res() response: Response) {
    const data = await this.commentsRepository.geCommentById(id);
    if (!data) return response.sendStatus(HttpStatus.NOT_FOUND);
    return response.status(HttpStatus.OK).send(data);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async updateComment(
    @Param('id') id: string,
    @Body() body: ContentValidation,
    @CurrentUser()
    accountData: Pick<UserType, 'id'> &
      Pick<UserType['accountData'], 'email' | 'login'>,
    @Res() response: Response,
  ) {
    await this.commentsRepository.updateComment({
      id,
      userId: accountData.id,
      content: body.content,
    });
    return response.sendStatus(HttpStatus.NO_CONTENT);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id/like-status')
  async updateLikeStatus(
    @Param('id') id: string,
    @Body() body: LikeStatusValidation,
    @CurrentUser()
    accountData: Pick<UserType, 'id'> &
      Pick<UserType['accountData'], 'email' | 'login'>,
    @Res() response: Response,
  ) {
    await this.commentsRepository.updateLikeStatus({
      id,
      userId: accountData.id,
      likeStatus: body.likeStatus,
    });
    return response.sendStatus(HttpStatus.NO_CONTENT);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteComment(
    @Param('id') id: string,
    @CurrentUser()
    accountData: Pick<UserType, 'id'> &
      Pick<UserType['accountData'], 'email' | 'login'>,
    @Res() response: Response,
  ) {
    await this.commentsRepository.deleteComment({
      id,
      userId: accountData.id,
    });
    return response.sendStatus(HttpStatus.NO_CONTENT);
  }
}
