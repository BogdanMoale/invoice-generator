"use server";
import * as z from "zod";
import { SettingsSchema } from "@/schemas";
import { getUserByEmail, getUserById } from "@/helpers/user-data";
import { currentUser } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export const config = {
  runtime: "nodejs",
};

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser();
  if (!user) {
    return {
      error: "Forbidden",
    };
  }
  const existingUser = await getUserById(user.id!);
  if (!existingUser) {
    return {
      error: "Forbidden",
    };
  }

  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  if (values.email && values.email !== existingUser.email) {
    const existingEmail = await getUserByEmail(values.email);
    if (existingEmail && existingEmail.id !== user.id) {
      return {
        error: "User already exists with this email",
      };
    }
  }
  if (values.password && values.newPassword && existingUser.password) {
    const passwordMatch = await bcrypt.compare(
      values.password,
      existingUser.password
    );

    if (!passwordMatch) {
      return {
        error: "Incorrect password",
      };
    }
    const hashedPassword = await bcrypt.hash(values.newPassword, 10);
    values.password = hashedPassword;
    values.newPassword = undefined;
  }
  const updatedUser = await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      ...values,
    },
  });

  const session = await auth();
  if (session) {
    session.user = {
      ...session.user,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      companyName: updatedUser.companyName ?? "",
    };
  }

  console.log("session from server action", session);

  return {
    success: "User's settings updated",
    session,
  };
};
