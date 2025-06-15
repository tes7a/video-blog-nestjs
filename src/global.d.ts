declare global {
  interface JwtPayload<T = unknown> {
    [key: string]: unknown;
    user: T;
    deviceId: string;
  }

  interface ErrorType {
    message: string;
    field: string;
  }

  interface Tokens {
    accessToken: string;
    refreshToken: string;
  }

  namespace Express {
    interface User {
      id: string;
      accessToken: string;
      refreshToken: string;
      deviceId: string;
    }
  }
}

export {};
