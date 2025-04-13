declare global {
  interface JwtPayload<T = unknown> {
    [key: string]: unknown;
    user: T;
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
