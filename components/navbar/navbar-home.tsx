"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import ThemeToggleButton from "./theme";

const HomeNavbar = () => {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;
  const activePathnames = [
    "/",
    "/auth/login",
    "/auth/register",
    "/terms-of-service",
    "/privacy-policy",
    "/auth/reset",
    "/auth/new-password",
  ];
  const homeButtonPathnames = [
    "/auth/login",
    "/auth/register",
    "/auth/reset",
    "/auth/new-password",
    "/privacy-policy",
    "/terms-of-service",
  ];

  if (activePathnames.includes(pathname)) {
    return (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-4 h-16">
          {homeButtonPathnames.includes(pathname) && (
            <Link href="/">
              <Button
                variant="ghost"
                size="lg"
                className={`${
                  isActive("/") ? "text-primary font-bold" : ""
                } hover:text-green-500`}
              >
                Home
              </Button>
            </Link>
          )}
          <Link href="/auth/login">
            <Button
              variant="ghost"
              size="lg"
              className={`${
                isActive("/auth/login") ? "text-primary font-bold" : ""
              } hover:text-green-500`}
            >
              Login
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button
              variant="ghost"
              size="lg"
              className={`${
                isActive("/auth/register") ? "text-primary font-bold" : ""
              } hover:text-green-500`}
            >
              Register
            </Button>
          </Link>
        </div>
        <div className="flex-shrink-0">
          <ThemeToggleButton />
        </div>
      </div>
    );
  }

  return null;
};

export default HomeNavbar;
