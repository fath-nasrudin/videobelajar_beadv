import { compare, hash } from "bcrypt";
import { prisma } from "../../lib/prisma";
import { UserLoginInputSchema, UserRegisterInputSchema } from "./auth.schema";
import { signAccessToken } from "./auth.utils";

export async function register(data: UserRegisterInputSchema) {
  const hashedPw = await hash(data.password, 10);

  const user = await prisma.user.create({
    data: { ...data, password: hashedPw },
  });

  return user;
}

export async function login(
  data: UserLoginInputSchema
): Promise<{ accessToken: string; refreshToken: string }> {
  const user = await prisma.user.findFirst({ where: { email: data.email } });
  if (!user) throw new Error("Email or Password invalid");

  const isPasswordMatch = await compare(data.password, user.password);
  if (!isPasswordMatch) throw new Error("Email or Password invalid");

  const accessToken = signAccessToken({ userId: user.id });
  // save the hashed refresh token to the db
  return {
    accessToken,
    refreshToken: accessToken,
  };
}

export default {
  register,
  login,
};
