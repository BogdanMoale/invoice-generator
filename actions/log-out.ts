"use server";

import { signOut } from "@/auth";

export const logout = async () => {
  //here i can perform server side operations before logging out
  await signOut();
};
