import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";
import jwt from "jsonwebtoken";

export function mapPrismaError(err: unknown) {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        return {
          status: 409,
          message: `Data already exists`,
        };

      case "P2025":
        return {
          status: 404,
          message: "Data not found",
        };

      case "P2003":
        return {
          status: 400,
          message: "Invalid relation reference",
        };

      default:
        return {
          status: 400,
          message: "Database error",
        };
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return {
      status: 400,
      message: "Invalid request data",
    };
  }

  return null;
}

export function mapJwtError(err: unknown) {
  if (err instanceof jwt.TokenExpiredError) {
    return {
      status: 401,
      message: "Access token expired",
    };
  }

  if (err instanceof jwt.NotBeforeError) {
    return {
      status: 401,
      message: "Token not active yet",
    };
  }

  if (err instanceof jwt.JsonWebTokenError) {
    return {
      status: 401,
      message: "Invalid access token",
    };
  }

  return null;
}

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);

  const prismaError = mapPrismaError(err);
  if (prismaError) {
    return res.status(prismaError.status).json({
      success: false,
      message: prismaError.message,
    });
  }

  const jwtError = mapJwtError(err);
  if (jwtError) {
    return res.status(jwtError.status).json({
      success: false,
      message: jwtError.message,
    });
  }

  res.status(500).json({
    message: err.message || "Internal Server Error",
  });
}
