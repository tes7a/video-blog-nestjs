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
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { BlogsService, PostsService } from '../services';
import {
  BlogsQueryRepository,
  BlogsRepository,
  PostsQueryRepository,
} from '../infrastructure';
import {
  CreateBlogDTO,
  CreatePostDTO,
  GetBlogsDTO,
  GetPostsDTO,
  UpdateBlogDTO,
} from '../dto';
import { BasicAuthGuard, OptionalJwtAuthGuard } from '../../users/guards';
import { CurrentUser } from '../../users/decorators';
import { UserType } from '../../users/models';

@Controller('/blogs')
export class BlogsController {
  constructor(
    private blogsService: BlogsService,
    private postsService: PostsService,
    private blogsQuery: BlogsQueryRepository,
    private postsQuery: PostsQueryRepository,
    private blogsRepository: BlogsRepository,
  ) {}

  @Get('/:id')
  async getBlogById(@Param('id') id: string, @Res() response: Response) {
    const data = await this.blogsRepository.getBlogById(id);
    if (!data) return response.sendStatus(HttpStatus.NOT_FOUND);
    return response.status(HttpStatus.OK).send(data);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('/:id/posts')
  async getPostsByBlogId(
    @Param('id') id: string,
    @CurrentUser()
    @CurrentUser()
    user: Pick<UserType, 'id'>,
    @Query() query: GetPostsDTO,
    @Res() response: Response,
  ) {
    const data = await this.postsQuery.getAllPosts({
      query,
      blogId: id,
      userId: user.id,
    });
    if (!data) return response.sendStatus(HttpStatus.NOT_FOUND);
    return response.status(HttpStatus.OK).send(data);
  }

  @Get()
  async getAllBlogs(@Query() query: GetBlogsDTO, @Res() response: Response) {
    const data = await this.blogsQuery.getAllBlogs(query);
    if (!data) return response.sendStatus(HttpStatus.NOT_FOUND);
    return response.status(HttpStatus.OK).send(data);
  }

  @UseGuards(BasicAuthGuard)
  @Post()
  async crateBlog(@Body() body: CreateBlogDTO, @Res() response: Response) {
    const data = await this.blogsService.createBlog(body);
    if (!data) return response.status(HttpStatus.NOT_FOUND).send(data);
    return response.status(HttpStatus.CREATED).send(data);
  }

  @UseGuards(BasicAuthGuard)
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

  @UseGuards(BasicAuthGuard)
  @Put('/:id')
  async updateBlog(
    @Param('id') id: string,
    @Body() body: UpdateBlogDTO,
    @Res() response: Response,
  ) {
    const data = await await this.blogsRepository.updateBlog({
      id,
      data: body,
    });
    if (!data) return response.status(HttpStatus.NOT_FOUND).send(data);
    return response.sendStatus(HttpStatus.NO_CONTENT);
  }

  @UseGuards(BasicAuthGuard)
  @Delete('/:id')
  async deleteBlog(@Param('id') id: string, @Res() response: Response) {
    const data = await this.blogsRepository.deleteBlog(id);
    if (!data) return response.sendStatus(HttpStatus.NOT_FOUND);
    return response.sendStatus(HttpStatus.NO_CONTENT);
  }
}
