import type { IBaseUser } from "../users";

export interface IJwtPayload extends IBaseUser {}
export interface ITokens {
  accessToken: string;
  refreshToken: string;
}
