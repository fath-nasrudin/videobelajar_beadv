import "express";
import { User } from "../features/user/user.schema";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: User["id"];
      };
    }
  }
}
