import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDTO } from 'src/dto';

import { UsersService } from 'src/services';

@Controller('/users')
export class UsersController {
  constructor(private users: UsersService) {}

  @Post()
  async createUser(
    @Body()
    body: CreateUserDTO,
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
    if (!data) return response.send(HttpStatus.NOT_FOUND);
    return response.send(HttpStatus.NO_CONTENT);
  }
}
