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

import {
  CreateBlogDTO,
  CreatePostDTO,
  GetBlogsDTO,
  GetPostsDTO,
  UpdateBlogDTO,
} from '../dto';
import { BlogsService } from './blogs.service';
import { PostsService } from 'src/posts/posts.service';
import { BlogsQueryRepository } from './blogs-query.repository';
import { PostsQueryRepository } from 'src/posts/posts-query.repository';

@Controller('/blogs')
export class BlogsController {
  constructor(
    private blogsService: BlogsService,
    private postsService: PostsService,
    private blogsQuery: BlogsQueryRepository,
    private postsQuery: PostsQueryRepository,
  ) {}

  @Get('/:id')
  async getBlogById(@Param('id') id: string, @Res() response: Response) {
    const data = await this.blogsService.getBlogById(id);
    if (!data) return response.sendStatus(HttpStatus.NOT_FOUND);
    return response.status(HttpStatus.OK).send(data);
  }

  @Get('/:id/posts')
  async getPostsByBlogId(
    @Param('id') id: string,
    @Query() query: GetPostsDTO,
    @Res() response: Response,
  ) {
    const data = await this.postsQuery.getAllPosts({ query, blogId: id });
    if (!data) return response.sendStatus(HttpStatus.NOT_FOUND);
    return response.status(HttpStatus.OK).send(data);
  }

  @Get()
  async getAllBlogs(@Query() query: GetBlogsDTO, @Res() response: Response) {
    const data = await this.blogsQuery.getAllBlogs(query);
    if (!data) return response.sendStatus(HttpStatus.NOT_FOUND);
    return response.status(HttpStatus.OK).send(data);
  }

  @Post()
  async crateBlog(@Body() body: CreateBlogDTO, @Res() response: Response) {
    const data = await this.blogsService.createBlog(body);
    if (!data) return response.status(HttpStatus.NOT_FOUND).send(data);
    return response.status(HttpStatus.CREATED).send(data);
  }

  @Post('/:id/posts')
  async createPostByBlogId(
    @Param('id') id: string,
    @Body() body: Omit<CreatePostDTO, 'blogId'>,
    @Res() response: Response,
  ) {
    const data = await this.postsService.createPost({ ...body, blogId: id });
    if (!data) return response.sendStatus(HttpStatus.NOT_FOUND);
    return response.status(HttpStatus.CREATED).send(data);
  }

  @Put('/:id')
  async updateBlog(
    @Param('id') id: string,
    @Body() body: UpdateBlogDTO,
    @Res() response: Response,
  ) {
    const data = await this.blogsService.updateBlog({ id, data: body });
    if (!data) return response.status(HttpStatus.NOT_FOUND).send(data);
    return response.sendStatus(HttpStatus.NO_CONTENT);
  }

  @Delete('/:id')
  async deleteBlog(@Param('id') id: string, @Res() response: Response) {
    const data = await this.blogsService.deleteBlog(id);
    if (!data) return response.sendStatus(HttpStatus.NOT_FOUND);
    return response.sendStatus(HttpStatus.NO_CONTENT);
  }
}
