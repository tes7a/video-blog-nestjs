import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUserId = createParamDecorator(
  (
    data: unknown,
    context: ExecutionContext,
  ): Tokens => {
    const request = context.switchToHttp().getRequest();

    if (!request.user.accessToken || !request.user.refreshToken)
      throw new Error('Local Guard must be used');

    return {
      accessToken: request.user.accessToken,
      refreshToken: request.user.refreshToken,
    };
  },
);
