"use server";
import { getPasswordResetTokenByToken } from "@/helpers/password-reset-token";
import { getUserByEmail } from "@/helpers/user-data";
import { db } from "@/lib/db";
import { NewPasswordSchema } from "@/schemas";
import * as z from "zod";
import bcrypt from "bcryptjs";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token: string | null
) => {
  if (!token) {
    return { error: "Missing token!" };
  }
  const validatedFields = NewPasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }
  const { password } = validatedFields.data;
  const resetToken = await getPasswordResetTokenByToken(token);

  if (!resetToken) {
    return { error: "Invalid token! " };
  }
  const user = await getUserByEmail(resetToken.email);
  if (!user) {
    return { error: "Email does not exist" };
  }
  if (new Date(resetToken.expiresAt) < new Date()) {
    return {
      error: "Token expired! please request a new one",
    };
  }

  // hash the password, and update it in the database
  const hashedPassword = await bcrypt.hash(password, 10);
  await db.passwordResetToken.delete({
    where: {
      id: resetToken.id,
    },
  });
  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
    },
  });
  return { success: "password reset successfully" };
};
