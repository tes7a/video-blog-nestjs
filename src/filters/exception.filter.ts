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
    const errorsResponse = { errorsMessages: [] };

    if (response.headersSent) return;

    if (status === 400) {
      if (!Array.isArray(responseBody.message)) {
        errorsResponse.errorsMessages.push({
          message: responseBody.message,
          field: responseBody.field,
        });
        return response.status(status).json(errorsResponse);
      }

      responseBody.message.forEach((m) =>
        errorsResponse.errorsMessages.push(m),
      );

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
