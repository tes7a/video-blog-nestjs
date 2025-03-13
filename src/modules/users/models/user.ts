export interface UserType {
  id: string;
  token: string;
  accountData: {
    login: string;
    passwordHash: string;
    passwordSalt: string;
    recoveryCode: string;
    email: string;
    createdAt: string;
  };
  emailConfirmation: {
    confirmationCode: string;
    expirationDate: Date;
    isConfirmed: boolean;
  };
}

export interface GetUsersOutputType {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Array<
    Pick<UserType, 'id'> &
      Pick<UserType['accountData'], 'email' | 'login' | 'createdAt'>
  >;
}

export interface CreateUserOutputType {
  id: string;
  login: string;
  email: string;
  createdAt: string;
}

export class UserDBModel {
  constructor(public params: UserType) {}
}
