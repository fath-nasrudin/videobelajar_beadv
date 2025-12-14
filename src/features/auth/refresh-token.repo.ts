import { prisma } from "../../lib/prisma";
import { RefreshToken } from "./refresh-token.schema";

export async function createRefreshToken(data: RefreshToken) {
  return prisma.refreshToken.create({ data });
}

export async function findRefreshTokenById(refreshTokenId: string) {
  return prisma.refreshToken.findFirst({ where: { id: refreshTokenId } });
}

export async function revokeRefreshTokenById(refreshTokenId: string) {
  return prisma.refreshToken.update({
    where: { id: refreshTokenId },
    data: { revokedAt: new Date() },
  });
}
export default {
  createRefreshToken,
  findRefreshTokenById,
  revokeRefreshTokenById,
};
