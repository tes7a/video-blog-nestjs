import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { PostsService } from '../services';
import {
  CommentsQueryRepository,
  PostsQueryRepository,
  PostsRepository,
} from '../infrastructure';
import { GetCommentDTO, GetPostsDTO } from '../dto';
import {
  ContentValidation,
  LikeStatusValidation,
  PostValidation,
} from '../validation';
import {
  BasicAuthGuard,
  JwtAuthGuard,
  OptionalJwtAuthGuard,
} from '../../users/guards';
import { CurrentUser } from '../../users/decorators';
import { UserType } from '../../users/models';

@Controller('/posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private postsRepository: PostsRepository,
    private postsQuery: PostsQueryRepository,
    private commentsQuery: CommentsQueryRepository,
  ) {}

  @Get('/:id')
  async getPostById(@Param('id') id: string, @Res() response: Response) {
    const data = await this.postsRepository.getPostById(id);
    if (!data) return response.sendStatus(HttpStatus.NOT_FOUND);
    return response.status(HttpStatus.OK).send(data);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('/:id/comments')
  async getCommentsByPostId(
    @Param('id') id: string,
    @Req()
    req: Request & {
      user?: UserType;
    },
    @Query() query: GetCommentDTO,
    @Res() response: Response,
  ) {
    const data = await this.commentsQuery.getAllComments({
      query,
      postId: id,
      userId: req.user?.id ?? null,
    });
    if (!data) return response.sendStatus(HttpStatus.NOT_FOUND);
    return response.status(HttpStatus.OK).send(data);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async getAllPosts(
    @Req()
    req: Request & {
      user?: UserType;
    },
    @Query() query: GetPostsDTO,
    @Res() response: Response,
  ) {
    const data = await this.postsQuery.getAllPosts({
      query,
      userId: req.user?.id ?? null,
    });
    if (!data) return response.sendStatus(HttpStatus.NOT_FOUND);
    return response.status(HttpStatus.OK).send(data);
  }

  @UseGuards(BasicAuthGuard)
  @Post()
  async createPost(@Body() body: PostValidation, @Res() response: Response) {
    const data = await this.postsService.createPost(body);
    if (!data) return response.sendStatus(HttpStatus.NOT_FOUND);
    return response.status(HttpStatus.CREATED).send(data);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:id/comments')
  async createComment(
    @Param('id') id: string,
    @CurrentUser()
    accountData: Pick<UserType, 'id'> &
      Pick<UserType['accountData'], 'email' | 'login'>,
    @Body() body: ContentValidation,
    @Res() response: Response,
  ) {
    const data = await this.postsService.createComment({
      ...body,
      postId: id,
      userId: accountData.id,
      userLogin: accountData.login,
    });
    if (!data) return response.sendStatus(HttpStatus.NOT_FOUND);
    return response.status(HttpStatus.CREATED).send(data);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id/like-status')
  async updateLikeStatus(
    @Param('id') id: string,
    @CurrentUser()
    accountData: Pick<UserType, 'id'> &
      Pick<UserType['accountData'], 'email' | 'login'>,
    @Body() body: LikeStatusValidation,
    @Res() response: Response,
  ) {
    const data = await this.postsRepository.updateLikeStatus({
      likeStatus: body.likeStatus,
      postId: id,
      userId: accountData.id,
      userLogin: accountData.login,
    });
    if (!data) return response.sendStatus(HttpStatus.NOT_FOUND);
    return response.sendStatus(HttpStatus.NO_CONTENT);
  }

  @UseGuards(BasicAuthGuard)
  @Put('/:id')
  async updatePost(
    @Param('id') id: string,
    @Body() body: PostValidation,
    @Res() response: Response,
  ) {
    const data = await this.postsRepository.updatePost({ id, body });
    if (!data) return response.sendStatus(HttpStatus.NOT_FOUND);
    return response.sendStatus(HttpStatus.NO_CONTENT);
  }

  @UseGuards(BasicAuthGuard)
  @Delete('/:id')
  async deletePost(@Param('id') id: string, @Res() response: Response) {
    const data = await this.postsRepository.deletePost(id);
    if (!data) return response.sendStatus(HttpStatus.NOT_FOUND);
    return response.sendStatus(HttpStatus.NO_CONTENT);
  }
}
