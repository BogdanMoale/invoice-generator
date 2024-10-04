"use client";

import { Card, CardContent, CardHeader } from "../ui/card";
import { Header } from "@/components/auth/header";
import { on } from "events";
import { X } from "lucide-react";

interface FormCardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  title: string;
  onClose: () => void;
}

export const FormCardWrapper = ({
  children,
  title,
  headerLabel,
  onClose,
}: FormCardWrapperProps) => {
  return (
    <Card className=" w-full max-w-[400px]">
      <button
        type="button"
        className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600"
        onClick={onClose}
      >
        <X className="w-6 h-6" />
      </button>
      <CardHeader>
        <Header title={title} label={headerLabel}></Header>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};
