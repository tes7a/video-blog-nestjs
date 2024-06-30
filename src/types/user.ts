import { Types } from 'mongoose';

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
    isConfirmed: string;
  };
}

export interface CreateUserOutput {
  id: string;
  login: string;
  email: string;
  createdAt: string;
}
