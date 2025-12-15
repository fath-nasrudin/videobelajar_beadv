import { config } from "../../config";
import emailService from "../email.service";
import userRepo from "../user/user.repo";
import emailVerificationDomain from "./email-verification.domain";
import emailVerificationRepo from "./email-verification.repo";

export async function sendEmailVerification(userId: string) {
  const user = await userRepo.findUserById(userId);
  if (!user) throw new Error("User Not Found");

  const { token, evObject } =
    emailVerificationDomain.createEmailVerification(user);

  // invalid token email sebelumnya yang masih aktif
  await emailVerificationRepo.invalidEmailVerificationToken(user.id);

  // simpan data sekarang
  await emailVerificationRepo.createEmailVerificationRecord(evObject);

  const verificationLink = `${config.emailVerification.url.full}?token=${token}`;
  // kirim email
  return emailService.sendVerificationEmail({ user, verificationLink });
}

export async function verifyEmailToken({ token }: { token: string }) {
  const hashedToken = emailVerificationDomain.hashEmailVerificationToken(token);
  try {
    const record = await emailVerificationRepo.findEVByTokenHash(hashedToken);
    if (!record) throw new Error("Token Not Found");

    const user = await userRepo.findUserById(record?.userId);
    if (!user) throw new Error("User Not Found");
    const userId = user.id;

    emailVerificationDomain.verifyEmailToken({ evObject: record, user });

    await userRepo.updateUserAsVerified(userId);
    await emailVerificationRepo.updateEVasUsedById(record.id);

    return { data: user, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export default {
  sendEmailVerification,
  verifyEmailToken,
};
