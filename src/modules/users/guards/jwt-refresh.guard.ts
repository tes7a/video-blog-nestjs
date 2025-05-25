import { Request, Response } from 'express';
import { ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const cookie = request.headers['cookie'];

    if (!cookie) {
      response.status(HttpStatus.UNAUTHORIZED).send({
        statusCode: HttpStatus.UNAUTHORIZED,
        error: 'Authorization error',
        message: 'Refresh token not found',
      });
      return;
    }

    return super.canActivate(context) as boolean | Promise<boolean>;
  }
}
