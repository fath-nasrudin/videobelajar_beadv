import { hash } from "bcrypt";
import { prisma } from "../../lib/prisma";
import { UserRegisterInputSchema } from "./auth.schema";

export async function register(data: UserRegisterInputSchema) {
  const hashedPw = await hash(data.password, 10);

  const user = await prisma.user.create({
    data: { ...data, password: hashedPw },
  });

  return user;
}

export default {
  register,
};
