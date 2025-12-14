import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

export function verify(req: Request, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization;
  if (!authorization) throw new Error("authorization on header required");

  const token = authorization.split(" ")[1];
  if (!token)
    throw new Error(
      'Invalid authorization format. It should be "Bearer your_access_token"'
    );

  const payload = jwt.verify(token, process.env.JWT_SECRET!);

  if (typeof payload === "string") throw new Error("Invalid authorization");

  req.user = { id: payload.userId };
  next();
}

export default {
  verify,
};
