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

import { PostsService } from '../services';
import {
  CommentsQueryRepository,
  PostsQueryRepository,
  PostsRepository,
} from '../infrastructure';
import {
  CreateCommentDTO,
  CreatePostDTO,
  GetPostsDTO,
  UpdatePostDTO,
} from '../dto';

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
    const data = await this.postsRepository.updatePost({ id, body });
    if (!data) return response.sendStatus(HttpStatus.NOT_FOUND);
    return response.sendStatus(HttpStatus.NO_CONTENT);
  }

  @Delete('/:id')
  async deletePost(@Param('id') id: string, @Res() response: Response) {
    const data = await this.postsRepository.deletePost(id);
    if (!data) return response.sendStatus(HttpStatus.NOT_FOUND);
    return response.sendStatus(HttpStatus.NO_CONTENT);
  }
}
