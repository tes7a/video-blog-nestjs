import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUserId = createParamDecorator(
  (data: unknown, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();

    if (!request.user.accessToken) throw new Error('Local Guard must be used');

    return request.user.accessToken as string;
  },
);
