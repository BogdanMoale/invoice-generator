"use client";

import { useRouter } from "next/navigation";

interface LogginButtonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

export const LogginButton = ({
  children,
  mode = "redirect",
  asChild,
}: LogginButtonProps) => {
  const router = useRouter();
  const onClickHandler = () => {
    router.push("/auth/register");
  };

  return (
    <span onClick={onClickHandler} className="cursor-pointer">
      {children}
    </span>
  );
};
