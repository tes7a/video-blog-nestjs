import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';

import { CommentsRepository } from '../infrastructure';
import { JwtAuthGuard, OptionalJwtAuthGuard } from '../../users/guards';
import { CurrentUser } from '../../users/decorators';
import { UserType } from '../../users/models';
import { CommentViewDto } from '../dto';
import { ContentValidation, LikeStatusValidation } from '../validation';

@ApiTags('Comments')
@Controller('/comments')
export class CommentsController {
  constructor(private commentsRepository: CommentsRepository) {}

  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get comment by id' })
  @ApiParam({ name: 'id', description: 'Comment id' })
  @ApiResponse({
    status: 200,
    description: 'Comment found',
    type: CommentViewDto,
  })
  @ApiResponse({ status: 404, description: 'Not found' })
  @Get('/:id')
  async getCommentById(
    @Req()
    req: Request & {
      user?: UserType;
    },
    @Param('id') id: string,
    @Res() response: Response,
  ) {
    const data = await this.commentsRepository.geCommentById(
      id,
      req.user?.id ?? null,
    );
    if (!data) return response.sendStatus(HttpStatus.NOT_FOUND);
    return response.status(HttpStatus.OK).send(data);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update comment content' })
  @ApiParam({ name: 'id', description: 'Comment id' })
  @ApiBody({ type: ContentValidation })
  @ApiResponse({ status: 204, description: 'Comment updated' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update like status for comment' })
  @ApiParam({ name: 'id', description: 'Comment id' })
  @ApiBody({ type: LikeStatusValidation })
  @ApiResponse({ status: 204, description: 'Status updated' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete comment' })
  @ApiParam({ name: 'id', description: 'Comment id' })
  @ApiResponse({ status: 204, description: 'Comment deleted' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
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
