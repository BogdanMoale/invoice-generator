"use server";

import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/helpers/user-data";
// import { generateVerificationToken } from "@/lib/tokens";
// import { sendEmail } from "@/lib/email";

export const runtime = "nodejs";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  //validate the values on the backend
  const validationResult = RegisterSchema.safeParse(values);

  if (!validationResult.success) {
    return { error: "Invalid fields" };
  }

  const { email, password, name, companyName } = validationResult.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "User already exists with this email" };
  }

  //new user
  const newUser = await db.user.create({
    data: {
      name,
      companyName,
      email,
      password: hashedPassword,
    },
  });

  // entry in the Account table
  await db.account.create({
    data: {
      userId: newUser.id,
      provider: "credentials",
      providerAccountId: newUser.id,
      type: "credentials",
    },
  });

  // const verificationToken = await generateVerificationToken(email);
  // await sendEmail(email, verificationToken);

  return { success: "User created successfully" };
};
