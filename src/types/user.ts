export interface User {
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
    expirationDate: string;
    isConfirmed: boolean;
  };
}

export interface GetUsersOutput {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Array<
    Pick<User, 'id'> &
      Pick<User['accountData'], 'email' | 'login' | 'createdAt'>
  >;
}

export interface CreateUserOutput {
  id: string;
  login: string;
  email: string;
  createdAt: string;
}
