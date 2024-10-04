"use server";

import * as z from "zod";
import { signIn } from "@/auth";

import { LoginSchema } from "@/schemas";
import { DEFAULT_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  //validate the values on the backend
  const validationResult = LoginSchema.safeParse(values);

  if (!validationResult.success) {
    return { error: "Invalid fields" };
  }

  const { email, password } = validationResult.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_REDIRECT,
    });
  } catch (e) {
    if (e instanceof AuthError) {
      switch (e.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };
        default:
          return { error: "Unknown error" };
      }
    }

    throw e;
  }
};
