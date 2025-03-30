declare global {
  interface JwtPayload {
    [key: string]: unknown;
    userId: string;
  }
}
declare global {
  interface ErrorType {
    message: string;
    field: string;
  }
}

declare global {
  interface Tokens {
    accessToken: string;
    refreshToken: string;
  }
}

export {};
