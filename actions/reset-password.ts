"use server";
// import { sendPasswordResetEmail } from "@/lib/email";
import { generatePasswordResetToken } from "@/lib/tokens";
import { ResetPasswordSchema } from "@/schemas";
import { getUserByEmail } from "@/helpers/user-data";

import * as z from "zod";

export const resetPassword = async (
  values: z.infer<typeof ResetPasswordSchema>
) => {
  const validatedValues = ResetPasswordSchema.safeParse(values);

  if (!validatedValues.success) {
    return { error: "Invalid email!" };
  }

  const { email } = validatedValues.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "User does not exist with this email" };
  }

  const passwordResetToken = await generatePasswordResetToken(email);

  // await sendPasswordResetEmail(
  //   passwordResetToken.email,
  //   passwordResetToken.token
  // );
  const resetUrl = `/auth/new-password?token=${passwordResetToken.token}`;

  return { success: "Redirecting to reset page", resetUrl };
};
