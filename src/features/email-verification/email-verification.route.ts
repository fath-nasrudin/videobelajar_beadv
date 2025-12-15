import { Router, Router as IRouter, Request, Response } from "express";
import authMiddleware from "../auth/auth.middleware";
import emailVerificationService from "./email-verification.service";

const router: IRouter = Router();

router.get(
  "/send",
  authMiddleware.verify,
  async (req: Request, res: Response) => {
    const userData = req.user;
    if (!userData) throw new Error("Not Authenticated");

    const { data, error } =
      await emailVerificationService.sendEmailVerification(userData.id);

    if (error) {
      res.status(400).json({
        message: "Failed to send email verification",
        error,
      });
      return;
    }

    res.status(200).json({
      message:
        "Email Verification has Sent to your email. Check your spam email if not appear in the inbox",
      data,
    });
    return;
  }
);

router.get("/verify", async (req: Request, res: Response) => {
  const token = req.query.token as string;
  if (!token) throw new Error("Token Not Found");
  if (typeof token !== "string")
    throw new Error("Something went wrong! Somehow token is not a string");

  const { data, error } = await emailVerificationService.verifyEmailToken({
    token,
  });

  if (data) {
    res.status(200).send(`User success verified. You can close this page`);
    return;
  }

  if (error) {
    let message = "Something unknown happened. Failed to verify";
    if (error instanceof Error) message = error.message;

    res.status(400).send(message);
    return;
  }
});

export const emailVerificationRouter = router;
