import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/types';

export const CurrentUser = createParamDecorator(
  (
    data: unknown,
    context: ExecutionContext,
  ): Pick<User, 'id'> & Pick<User['accountData'], 'email' | 'login'> => {
    const request = context.switchToHttp().getRequest();

    if (!request.accountData) throw new Error('Jwt Guard must be used');

    return request.accountData as Pick<User, 'id'> &
      Pick<User['accountData'], 'email' | 'login'>;
  },
);
