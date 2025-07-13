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

import { PostsService } from '../services';
import {
  CommentsQueryRepository,
  PostsQueryRepository,
  PostsRepository,
} from '../infrastructure';
import {
  GetCommentDTO,
  GetPostsDTO,
  PostViewDto,
  PostsPaginationDto,
  CommentViewDto,
  CommentsPaginationDto,
} from '../dto';
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

@ApiTags('Posts')
@Controller('/posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private postsRepository: PostsRepository,
    private postsQuery: PostsQueryRepository,
    private commentsQuery: CommentsQueryRepository,
  ) {}

  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get post by id' })
  @ApiParam({ name: 'id', description: 'Post id' })
  @ApiResponse({ status: 200, description: 'Post found', type: PostViewDto })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @Get('/:id')
  async getPostById(
    @Req()
    req: Request & {
      user?: UserType;
    },
    @Param('id') id: string,
    @Res() response: Response,
  ) {
    const data = await this.postsRepository.getPostById(
      id,
      req.user?.id ?? null,
    );
    if (!data) return response.sendStatus(HttpStatus.NOT_FOUND);
    return response.status(HttpStatus.OK).send(data);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get comments for post' })
  @ApiParam({ name: 'id', description: 'Post id' })
  @ApiQuery({ name: 'pageNumber', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'sortDirection', required: false })
  @ApiResponse({
    status: 200,
    description: 'Comments list',
    type: CommentsPaginationDto,
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
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
    const post = await this.postsRepository.getPostById(id);

    if (!post) return response.sendStatus(HttpStatus.NOT_FOUND);

    const data = await this.commentsQuery.getAllComments({
      query,
      postId: id,
      userId: req.user?.id ?? null,
    });
    if (!data) return response.sendStatus(HttpStatus.NOT_FOUND);
    return response.status(HttpStatus.OK).send(data);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all posts' })
  @ApiQuery({ name: 'pageNumber', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'sortDirection', required: false })
  @ApiResponse({
    status: 200,
    description: 'Posts list',
    type: PostsPaginationDto,
  })
  @ApiResponse({ status: 404, description: 'Not found' })
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
  @ApiBasicAuth()
  @ApiOperation({ summary: 'Create post' })
  @ApiBody({ type: PostValidation })
  @ApiResponse({ status: 201, description: 'Post created', type: PostViewDto })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  @Post()
  async createPost(@Body() body: PostValidation, @Res() response: Response) {
    const data = await this.postsService.createPost(body);
    if (!data) return response.sendStatus(HttpStatus.NOT_FOUND);
    return response.status(HttpStatus.CREATED).send(data);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create comment for post' })
  @ApiParam({ name: 'id', description: 'Post id' })
  @ApiBody({ type: ContentValidation })
  @ApiResponse({
    status: 201,
    description: 'Comment created',
    type: CommentViewDto,
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @Post('/:id/comments')
  async createComment(
    @Param('id') id: string,
    @CurrentUser()
    accountData: Pick<UserType, 'id'> &
      Pick<UserType['accountData'], 'email' | 'login'>,
    @Body() body: ContentValidation,
    @Res() response: Response,
  ) {
    const post = await this.postsRepository.getPostById(id);

    if (!post) return response.sendStatus(HttpStatus.NOT_FOUND);

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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update like status for post' })
  @ApiParam({ name: 'id', description: 'Post id' })
  @ApiBody({ type: LikeStatusValidation })
  @ApiResponse({ status: 204, description: 'Status updated' })
  @ApiResponse({ status: 404, description: 'Post not found' })
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
  @ApiBasicAuth()
  @ApiOperation({ summary: 'Update post' })
  @ApiParam({ name: 'id', description: 'Post id' })
  @ApiBody({ type: PostValidation })
  @ApiResponse({ status: 204, description: 'Post updated' })
  @ApiResponse({ status: 404, description: 'Post not found' })
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
  @ApiBasicAuth()
  @ApiOperation({ summary: 'Delete post' })
  @ApiParam({ name: 'id', description: 'Post id' })
  @ApiResponse({ status: 204, description: 'Post deleted' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @Delete('/:id')
  async deletePost(@Param('id') id: string, @Res() response: Response) {
    const data = await this.postsRepository.deletePost(id);
    if (!data) return response.sendStatus(HttpStatus.NOT_FOUND);
    return response.sendStatus(HttpStatus.NO_CONTENT);
  }
}
