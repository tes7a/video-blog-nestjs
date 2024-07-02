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

import { CreateBlogDTO, GetBlogsDTO, UpdateBlogDTO } from 'src/dto';
import { BlogsQueryRepository } from 'src/repository';
import { BlogService } from 'src/services';

@Controller('/blogs')
export class BlogsController {
  constructor(
    private blogService: BlogService,
    private blogsQuery: BlogsQueryRepository,
  ) {}

  @Get('/:id')
  async getBlogById(@Param('id') id: string, @Res() response: Response) {
    const data = await this.blogService.getBlogById(id);
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
    const data = await this.blogService.createBlog(body);
    if (!data) return response.status(HttpStatus.NOT_FOUND).send(data);
    return response.status(HttpStatus.CREATED).send(data);
  }

  @Put('/:id')
  async updateBlog(
    @Param('id') id: string,
    @Body() body: UpdateBlogDTO,
    @Res() response: Response,
  ) {
    const data = await this.blogService.updateBlog({ id, data: body });
    if (!data) return response.status(HttpStatus.NOT_FOUND).send(data);
    return response.sendStatus(HttpStatus.NO_CONTENT);
  }

  @Delete('/:id')
  async deleteBlog(@Param('id') id: string, @Res() response: Response) {
    const data = await this.blogService.deleteBlog(id);
    if (!data) return response.sendStatus(HttpStatus.NOT_FOUND);
    return response.sendStatus(HttpStatus.NO_CONTENT);
  }
}
