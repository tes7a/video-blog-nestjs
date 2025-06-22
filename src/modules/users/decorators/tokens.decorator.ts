import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Tokens = createParamDecorator(
  (
    data: unknown,
    context: ExecutionContext,
  ): Tokens & { userId: string; deviceId: string } => {
    const request = context.switchToHttp().getRequest();

    if (!request.user.accessToken || !request.user.refreshToken)
      throw new Error('Local Guard must be used');

    return {
      accessToken: request.user.accessToken,
      refreshToken: request.user.refreshToken,
      deviceId: request.user.deviceId,
      userId: request.user.userId,
    };
  },
);
