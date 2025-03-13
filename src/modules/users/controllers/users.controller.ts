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
import { Response } from 'express';

import { UsersService } from '../services/users.service';
import { UserValidation } from '../validation';
import { BasicAuthGuard } from '../guards';
import { UsersQueryRepository, UsersRepository } from '../infrastructure';
import { GetUsersDTO } from '../dto';

@UseGuards(BasicAuthGuard)
@Controller('/users')
export class UsersController {
  constructor(
    private users: UsersService,
    private usersQuery: UsersQueryRepository,
    private usersRepository: UsersRepository,
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
    const data = await this.users.createUserByAdmin(body);
    if (typeof data === 'string')
      return response.status(HttpStatus.NOT_FOUND).send(data);
    return response.status(HttpStatus.CREATED).send(data);
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string, @Res() response: Response) {
    const data = await this.usersRepository.deleteUser(id);
    if (!data) return response.sendStatus(HttpStatus.NOT_FOUND);
    return response.sendStatus(HttpStatus.NO_CONTENT);
  }
}
