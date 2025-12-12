import z from "zod";
import { userSchema } from "../user/user.schema";

export const userRegisterSchema = userSchema.pick({
  email: true,
  username: true,
  fullname: true,
  password: true,
});

export const userLoginSchema = z.object({
  identifier: z.string().min(1), // bisa email atau username
  password: z.string().min(1),
});

export type UserRegisterInputSchema = z.infer<typeof userRegisterSchema>;
export type UserLoginInputSchema = z.infer<typeof userLoginSchema>;
