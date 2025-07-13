import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Res,
  HttpStatus,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiResponse,
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { Response } from 'express';

import { UsersService } from '../services/users.service';
import { UserValidation } from '../validation';
import { BasicAuthGuard } from '../guards';
import { UsersQueryRepository, UsersRepository } from '../infrastructure';
import { GetUsersDTO, UsersPaginationDto, CreateUserResponseDto } from '../dto';

@ApiTags('Users')
@UseGuards(BasicAuthGuard)
@Controller('/users')
export class UsersController {
  constructor(
    private users: UsersService,
    private usersQuery: UsersQueryRepository,
    private usersRepository: UsersRepository,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiQuery({ name: 'searchLoginTerm', required: false })
  @ApiQuery({ name: 'searchEmailTerm', required: false })
  @ApiQuery({ name: 'pageNumber', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'sortDirection', required: false })
  @ApiResponse({
    status: 200,
    description: 'Users list',
    type: UsersPaginationDto,
  })
  @ApiResponse({ status: 404, description: 'Not found' })
  async getUsers(@Query() query: GetUsersDTO, @Res() response: Response) {
    const data = await this.usersQuery.getUsers(query);
    if (!data) return response.sendStatus(HttpStatus.NOT_FOUND);
    return response.status(HttpStatus.OK).send(data);
  }

  @Post()
  @ApiOperation({ summary: 'Create user by admin' })
  @ApiBody({ type: UserValidation })
  @ApiResponse({
    status: 201,
    description: 'User created',
    type: CreateUserResponseDto,
  })
  async createUser(
    @Body()
    body: UserValidation,
    @Res() response: Response,
  ) {
    const data = await this.users.createUserByAdmin(body);
    if (typeof data === 'string')
      return response.status(HttpStatus.NOT_FOUND).send(data);
    return response.status(HttpStatus.CREATED).send(data);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete user by id' })
  @ApiParam({ name: 'id', description: 'User id' })
  @ApiResponse({ status: 204, description: 'User deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteUser(@Param('id') id: string, @Res() response: Response) {
    const data = await this.usersRepository.deleteUser(id);
    if (!data) return response.sendStatus(HttpStatus.NOT_FOUND);
    return response.sendStatus(HttpStatus.NO_CONTENT);
  }
}
