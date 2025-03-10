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
  Res,
} from '@nestjs/common';
import { Response } from 'express';

import { PostsService } from '../services/posts.service';
import { PostsQueryRepository } from '../infrastructure/query/posts-query.repository';
import { CommentsQueryRepository } from '../../comments/infrastructure/query/comments-query.repository';
import {
  CreateCommentDTO,
  CreatePostDTO,
  GetPostsDTO,
  UpdatePostDTO,
} from '../../../dto';

@Controller('/posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private postsQuery: PostsQueryRepository,
    private commentsQuery: CommentsQueryRepository,
  ) {}

  @Get('/:id')
  async getPostById(@Param('id') id: string, @Res() response: Response) {
    const data = await this.postsService.getPostById(id);
    if (!data) return response.sendStatus(HttpStatus.NOT_FOUND);
    return response.status(HttpStatus.OK).send(data);
  }

  @Get('/:id/comments')
  async getCommentsByPostId(
    @Param('id') id: string,
    @Query() query: CreateCommentDTO,
    @Res() response: Response,
  ) {
    const data = await this.commentsQuery.getAllComments({ query, postId: id });
    if (!data) return response.sendStatus(HttpStatus.NOT_FOUND);
    return response.status(HttpStatus.OK).send(data);
  }

  @Get()
  async getAllPosts(@Query() query: GetPostsDTO, @Res() response: Response) {
    const data = await this.postsQuery.getAllPosts({ query });
    if (!data) return response.sendStatus(HttpStatus.NOT_FOUND);
    return response.status(HttpStatus.OK).send(data);
  }

  @Post()
  async createPost(@Body() body: CreatePostDTO, @Res() response: Response) {
    const data = await this.postsService.createPost(body);
    if (!data) return response.sendStatus(HttpStatus.NOT_FOUND);
    return response.status(HttpStatus.CREATED).send(data);
  }

  @Put('/:id')
  async updatePost(
    @Param('id') id: string,
    @Body() body: UpdatePostDTO,
    @Res() response: Response,
  ) {
    const data = await this.postsService.updatePost({ id, body });
    if (!data) return response.sendStatus(HttpStatus.NOT_FOUND);
    return response.sendStatus(HttpStatus.NO_CONTENT);
  }

  @Delete('/:id')
  async deletePost(@Param('id') id: string, @Res() response: Response) {
    const data = await this.postsService.deletePost(id);
    if (!data) return response.sendStatus(HttpStatus.NOT_FOUND);
    return response.sendStatus(HttpStatus.NO_CONTENT);
  }
}
