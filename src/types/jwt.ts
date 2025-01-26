export interface JwtPayload {
  [key: string]: unknown;
  userId: string;
}
