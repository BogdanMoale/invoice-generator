import { db } from "@/lib/db";

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const resetToken = await db.passwordResetToken.findUnique({
      where: {
        token,
      },
    });
    return resetToken;
  } catch (error) {
    console.error(`Error in getPasswordResetTokenByToken: ${error}`);
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const token = await db.passwordResetToken.findFirst({
      where: {
        email,
      },
    });
    return token;
  } catch (error) {
    // console.error(`Error in getPasswordResetTokenByEmail: ${error}`);
    return null;
  }
};
