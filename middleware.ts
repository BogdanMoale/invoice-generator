import authConfig from "./auth.config";
import NextAuth from "next-auth";
import { auth as authentication } from "@/auth";

import {
  apiAuth,
  authenticationRoutes,
  publicRoutes,
  DEFAULT_REDIRECT,
  adminRoutes,
} from "@/routes";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const session = await authentication();
  const isAdmin = session?.user?.role === "ADMIN";

  const { nextUrl } = req;
  const isUserLoggedIn = !!req.auth;

  const isApiRoute = nextUrl.pathname.startsWith(apiAuth);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthenticationRoute = authenticationRoutes.includes(nextUrl.pathname);
  const isAdminRoute = adminRoutes.includes(nextUrl.pathname);

  if (isApiRoute) {
    return;
  }

  if (isAuthenticationRoute) {
    if (isUserLoggedIn) {
      return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl));
    }
    return;
  }

  if (!isUserLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/auth/login", nextUrl));
  }

  if (isAdminRoute && !isAdmin) {
    return Response.redirect(new URL("/unauthorized", nextUrl));
  }

  return;
});

export const config = {
  //from clerk docs
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
