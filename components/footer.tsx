"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";

export const Footer: React.FC = () => {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;
  const activePathnames = [
    "/",
    "/terms-of-service",
    "/privacy-policy",
    "/auth/login",
    "/auth/register",
    "/auth/reset",
    "/auth/new-password",
  ];

  if (activePathnames.includes(pathname)) {
    return (
      <footer className="flex h-12 items-center justify-center w-full border-t">
        <div className="w-full max-w-[1280px] md:px-8 px-4 flex place-content-center">
          <div className="flex max-w-fit items-center gap-x-4">
            <Link href="/terms-of-service">
              <Button
                variant="ghost"
                size="lg"
                className={`${
                  isActive("/terms-of-service") ? "text-primary font-bold" : ""
                } hover:text-green-500`}
              >
                Terms of Service
              </Button>
            </Link>
            <Link href="/privacy-policy">
              <Button
                variant="ghost"
                size="lg"
                className={`${
                  isActive("/privacy-policy") ? "text-primary font-bold" : ""
                } hover:text-green-500`}
              >
                Privacy Policy
              </Button>
            </Link>
          </div>
        </div>
      </footer>
    );
  }
};
