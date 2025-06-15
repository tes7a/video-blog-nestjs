import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { UserType } from '../models';

export const CurrentUser = createParamDecorator(
  (
    data: unknown,
    context: ExecutionContext,
  ): Pick<UserType, 'id'> &
    Pick<UserType['accountData'], 'email' | 'login'> & { deviceId: string } => {
    const request = context.switchToHttp().getRequest();

    if (!request.user) throw new Error('Jwt Guard must be used');

    return request.user as Pick<UserType, 'id'> &
      Pick<UserType['accountData'], 'email' | 'login'> & { deviceId: string };
  },
);
