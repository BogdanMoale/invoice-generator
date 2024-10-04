import NextAuth, { type DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

export type ExtendedUser = DefaultSession["user"] & {
  role: "ADMIN" | "USER" | "CUSTOMER";
  isOAuth: boolean;
  companyName: string;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "ADMIN" | "USER" | "CUSTOMER";
    isTwoFactorEnabled: boolean;
  }
}
