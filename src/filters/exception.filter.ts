import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const responseBody: any = exception.getResponse();

    if (status === 400 && Array.isArray(responseBody.message)) {
      const errorsResponse = { errors: [] };

      responseBody.message.forEach((m) => errorsResponse.errors.push(m));

      return response.status(status).json(errorsResponse);
    }

    return response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: exception.message,
      path: request.url,
    });
  }
}
