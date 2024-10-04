import { v4 as uuidv4 } from "uuid";
import { getVerificationTokenByEmail } from "@/helpers/verify-token";
import { db } from "@/lib/db";
import { getPasswordResetTokenByEmail } from "@/helpers/password-reset-token";

export const generateVerificationToken = async (email: string) => {
  const existingToken = await getVerificationTokenByEmail(email);
  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60);
  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expiresAt,
    },
  });

  return verificationToken;
};

export const generatePasswordResetToken = async (email: string) => {
  const resetPasswordToken = uuidv4();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 5);

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await db.passwordResetToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token: resetPasswordToken,
      expiresAt,
    },
  });

  return passwordResetToken;
};
