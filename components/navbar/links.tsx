"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useCurrentUser } from "@/hooks/use-current-user";
import { MenuIcon, X } from "lucide-react";
import { signOut } from "next-auth/react";
import { ExitIcon } from "@radix-ui/react-icons";
import Image from "next/image";

const NavbarLinks = ({ user }: any) => {
  const pathname = usePathname();
  const currentUser = useCurrentUser();
  const [open, setOpen] = useState(false);

  const links = [
    ...(currentUser?.role !== "CUSTOMER"
      ? [{ label: "Customers", href: "/customers" }]
      : []),
    { label: "Invoices", href: "/invoices" },
    { label: "Payments", href: "/payments" },
  ];

  const handleMenuItemClick = () => setOpen(false);

  const renderLinkItem = ({ label, href }: { label: string; href: string }) => (
    <Link key={href} href={href} onClick={handleMenuItemClick}>
      <Button
        variant="ghost"
        size="lg"
        className={`capitalize ${
          pathname === href ? "text-primary font-bold" : "font-medium"
        }`}
      >
        {label}
      </Button>
    </Link>
  );

  const renderAdminLink = () =>
    currentUser?.role === "ADMIN" && (
      <div key="/users">
        {renderLinkItem({ label: "Users", href: "/users" })}
      </div>
    );

  const renderLogo = () => (
    <Link href="/">
      <Image
        src="/logo.webp"
        alt="App Logo"
        width={40}
        height={40}
        className="rounded-lg mr-4"
      />
    </Link>
  );

  // User is logged in, display the normal navbar content
  return (
    <>
      {/* Mobile Menu with Drawer */}
      <div className="md:hidden flex items-center gap-x-4">
        <Drawer open={open} onOpenChange={setOpen} direction="left">
          <DrawerTrigger asChild>
            <MenuIcon className="cursor-pointer" />
          </DrawerTrigger>
          <DrawerContent className="h-screen top-0 left-0 right-auto mt-0 w-64 rounded-none">
            <div className="mx-auto w-full p-5">
              <DrawerHeader>
                {/* {renderLogo()} */}
                <DrawerTitle>{currentUser?.name}</DrawerTitle>
                <DrawerDescription></DrawerDescription>
                <DrawerClose asChild>
                  <div className="w-full flex items-end justify-end">
                    <X />
                  </div>
                </DrawerClose>
              </DrawerHeader>
              <div className="p-4 pb-0 space-y-4">
                {links.map(({ label, href }) => (
                  <div key={href}>{renderLinkItem({ label, href })}</div>
                ))}
                <div>
                  {renderLinkItem({ label: "Settings", href: "/profile" })}
                </div>
                {renderAdminLink()}
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => {
                    signOut({ callbackUrl: "/" });
                    handleMenuItemClick();
                  }}
                  className="capitalize"
                >
                  <ExitIcon className="h-4 w-4 mr-2" /> Sign out
                </Button>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Desktop Menu */}
      <ul className="hidden md:flex items-center justify-center space-x-4">
        {/* <li>{renderLogo()}</li> */}
        {links.map(renderLinkItem)}
        {currentUser?.role === "ADMIN" &&
          renderLinkItem({ label: "Users", href: "/users" })}
        <li>{renderLinkItem({ label: "Settings", href: "/profile" })}</li>
        <li>
          <Button
            variant="ghost"
            size="lg"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="capitalize"
          >
            <ExitIcon className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </li>
      </ul>
    </>
  );
};

export default NavbarLinks;
