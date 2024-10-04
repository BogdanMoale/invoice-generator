"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";

import { DEFAULT_REDIRECT } from "@/routes";

export const Social = () => {
  //handle the auth provider
  const handleClickAuth = (provider: "google" | "github") => {
    signIn(provider, { callbackUrl: DEFAULT_REDIRECT });
  };

  return (
    <div className="flex items-center w-full gap-x-2">
      {/* GOOGLE */}
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={() => handleClickAuth("google")}
      >
        <FcGoogle className="h-5 w-5"></FcGoogle>
      </Button>

      {/* GITHUB */}
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={() => handleClickAuth("github")}
      >
        <FaGithub className="h-5 w-5"></FaGithub>
      </Button>
    </div>
  );
};
