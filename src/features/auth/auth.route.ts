import { Router, Router as IRouter, Request, Response } from "express";
import { userRegisterSchema } from "./auth.schema";
import authService from "./auth.service";

const router: IRouter = Router();

router.get("/register", async (req: Request, res: Response) => {
  const body = req.body;
  const data = await userRegisterSchema.parseAsync(body);

  const user = await authService.register(data);
  res.status(201).json({ message: "Success" });
});

export const authRouter = router;
