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
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';

import { BlogsService, PostsService } from '../services';
import {
  BlogsQueryRepository,
  BlogsRepository,
  PostsQueryRepository,
} from '../infrastructure';
import {
  GetBlogsDTO,
  GetPostsDTO,
  BlogViewDto,
  BlogsPaginationDto,
  PostViewDto,
  PostsPaginationDto,
} from '../dto';
import { BasicAuthGuard, OptionalJwtAuthGuard } from '../../users/guards';
import { BlogValidation, PostByIdValidation } from '../validation';
import { UserType } from '../../users/models';

@ApiTags('Blogs')
@Controller('/blogs')
export class BlogsController {
  constructor(
    private blogsService: BlogsService,
    private postsService: PostsService,
    private blogsQuery: BlogsQueryRepository,
    private postsQuery: PostsQueryRepository,
    private blogsRepository: BlogsRepository,
  ) {}

  @ApiOperation({ summary: 'Get blog by id' })
  @ApiParam({ name: 'id', description: 'Blog id' })
  @ApiResponse({ status: 200, description: 'Blog found', type: BlogViewDto })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  @Get('/:id')
  async getBlogById(@Param('id') id: string, @Res() response: Response) {
    const data = await this.blogsRepository.getBlogById(id);
    if (!data) return response.sendStatus(HttpStatus.NOT_FOUND);
    return response.status(HttpStatus.OK).send(data);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get posts for specific blog' })
  @ApiParam({ name: 'id', description: 'Blog id' })
  @ApiQuery({ name: 'pageNumber', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'sortDirection', required: false })
  @ApiResponse({
    status: 200,
    description: 'Posts list',
    type: PostsPaginationDto,
  })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  @Get('/:id/posts')
  async getPostsByBlogId(
    @Param('id') id: string,
    @Req()
    req: Request & {
      user?: UserType;
    },
    @Query() query: GetPostsDTO,
    @Res() response: Response,
  ) {
    const data = await this.postsQuery.getAllPosts({
      query,
      blogId: id,
      userId: req.user?.id ?? null,
    });
    if (!data) return response.sendStatus(HttpStatus.NOT_FOUND);
    return response.status(HttpStatus.OK).send(data);
  }

  @ApiOperation({ summary: 'Get all blogs' })
  @ApiQuery({ name: 'searchNameTerm', required: false })
  @ApiQuery({ name: 'pageNumber', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'sortDirection', required: false })
  @ApiResponse({
    status: 200,
    description: 'Blogs list',
    type: BlogsPaginationDto,
  })
  @ApiResponse({ status: 404, description: 'Not found' })
  @Get()
  async getAllBlogs(@Query() query: GetBlogsDTO, @Res() response: Response) {
    const data = await this.blogsQuery.getAllBlogs(query);
    if (!data) return response.sendStatus(HttpStatus.NOT_FOUND);
    return response.status(HttpStatus.OK).send(data);
  }

  @UseGuards(BasicAuthGuard)
  @ApiBasicAuth()
  @ApiOperation({ summary: 'Create blog' })
  @ApiBody({ type: BlogValidation, required: true })
  @ApiResponse({ status: 201, description: 'Blog created', type: BlogViewDto })
  @ApiResponse({ status: 404, description: 'Not found' })
  @Post()
  async crateBlog(@Body() body: BlogValidation, @Res() response: Response) {
    const data = await this.blogsService.createBlog(body);
    if (!data) return response.status(HttpStatus.NOT_FOUND).send(data);
    return response.status(HttpStatus.CREATED).send(data);
  }

  @UseGuards(BasicAuthGuard)
  @ApiBasicAuth()
  @ApiOperation({ summary: 'Create post for blog' })
  @ApiParam({ name: 'id', description: 'Blog id' })
  @ApiBody({ type: PostByIdValidation })
  @ApiResponse({ status: 201, description: 'Post created', type: PostViewDto })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  @Post('/:id/posts')
  async createPostByBlogId(
    @Param('id') id: string,
    @Body() body: PostByIdValidation,
    @Res() response: Response,
  ) {
    const data = await this.postsService.createPost({ ...body, blogId: id });
    if (!data) return response.sendStatus(HttpStatus.NOT_FOUND);
    return response.status(HttpStatus.CREATED).send(data);
  }

  @UseGuards(BasicAuthGuard)
  @ApiBasicAuth()
  @ApiOperation({ summary: 'Update blog' })
  @ApiParam({ name: 'id', description: 'Blog id' })
  @ApiBody({ type: BlogValidation })
  @ApiResponse({ status: 204, description: 'Blog updated' })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  @Put('/:id')
  async updateBlog(
    @Param('id') id: string,
    @Body() body: BlogValidation,
    @Res() response: Response,
  ) {
    const data = await this.blogsRepository.updateBlog({
      id,
      data: body,
    });
    if (!data) return response.status(HttpStatus.NOT_FOUND).send(data);
    return response.sendStatus(HttpStatus.NO_CONTENT);
  }

  @UseGuards(BasicAuthGuard)
  @ApiBasicAuth()
  @ApiOperation({ summary: 'Delete blog' })
  @ApiParam({ name: 'id', description: 'Blog id' })
  @ApiResponse({ status: 204, description: 'Blog deleted' })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  @Delete('/:id')
  async deleteBlog(@Param('id') id: string, @Res() response: Response) {
    const data = await this.blogsRepository.deleteBlog(id);
    if (!data) return response.sendStatus(HttpStatus.NOT_FOUND);
    return response.sendStatus(HttpStatus.NO_CONTENT);
  }
}
