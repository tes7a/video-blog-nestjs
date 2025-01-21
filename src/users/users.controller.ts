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
} from '@nestjs/common';
import { Response } from 'express';

import { GetUsersDTO } from '../dto';
import { UserValidation } from '../validation';
import { UsersService } from './users.service';
import { UsersQueryRepository } from './users-query.repository';

@Controller('/users')
export class UsersController {
  constructor(
    private users: UsersService,
    private usersQuery: UsersQueryRepository,
  ) {}

  @Get()
  async getUsers(@Query() query: GetUsersDTO, @Res() response: Response) {
    const data = await this.usersQuery.getUsers(query);
    if (!data) return response.sendStatus(HttpStatus.NOT_FOUND);
    return response.status(HttpStatus.OK).send(data);
  }

  @Post()
  async createUser(
    @Body()
    body: UserValidation,
    @Res() response: Response,
  ) {
    const data = await this.users.createUser(body);
    if (typeof data === 'string')
      return response.status(HttpStatus.NOT_FOUND).send(data);
    return response.status(HttpStatus.CREATED).send(data);
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string, @Res() response: Response) {
    const data = await this.users.deleteUser(id);
    if (!data) return response.sendStatus(HttpStatus.NOT_FOUND);
    return response.sendStatus(HttpStatus.NO_CONTENT);
  }
}
