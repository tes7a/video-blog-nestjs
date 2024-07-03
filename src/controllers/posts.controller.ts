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

import { PostsService } from 'src/services';
import { CreatePostDTO, GetPostsDTO, UpdatePostDTO } from 'src/dto';
import { PostsQueryRepository } from 'src/repository';

@Controller('/posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private postQuery: PostsQueryRepository,
  ) {}

  @Get('/:id')
  async getPostById(@Param('id') id: string, @Res() response: Response) {
    const data = await this.postsService.getPostById(id);
    if (!data) return response.sendStatus(HttpStatus.NOT_FOUND);
    return response.status(HttpStatus.OK).send(data);
  }

  @Get()
  async getAllPosts(@Query() query: GetPostsDTO, @Res() response: Response) {
    const data = await this.postQuery.getAllPosts({ query });
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
