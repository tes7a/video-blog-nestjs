import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUserId = createParamDecorator(
  (data: unknown, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();

    if (!request.user.id) throw new Error('Local Guard must be used');

    return request.user.id as string;
  },
);
