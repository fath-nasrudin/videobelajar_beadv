import jwt, { SignOptions } from "jsonwebtoken";

export type AccessTokenPayload = {
  userId: string;
};

const JWT_SECRET = process.env.JWT_SECRET as string;
const ACCESS_TOKEN_EXPIRES_IN = "15m";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export function signAccessToken(
  payload: AccessTokenPayload,
  options?: SignOptions
) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    ...options,
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, JWT_SECRET) as AccessTokenPayload;
}
