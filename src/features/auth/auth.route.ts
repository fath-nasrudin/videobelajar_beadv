import { Router, Router as IRouter, Request, Response } from "express";
import { userLoginSchema, userRegisterSchema } from "./auth.schema";
import authService from "./auth.service";

const router: IRouter = Router();

router.get("/register", async (req: Request, res: Response) => {
  const body = req.body;
  const data = await userRegisterSchema.parseAsync(body);

  const user = await authService.register(data);
  res.status(201).json({ message: "Success" });
});

router.get("/login", async (req: Request, res: Response) => {
  const body = req.body;
  const data = await userLoginSchema.parseAsync(body);

  const tokens = await authService.login(data);
  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/auth/refresh",
  });

  res.status(200).json({ message: "Success", data: tokens });
});
export const authRouter = router;
