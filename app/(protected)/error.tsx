"use client";

import { Button } from "@/components/ui/button";
import { FiAlertTriangle } from "react-icons/fi";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Error",
  description:
    "Oops! Something went wrong on the Invoiceraptor application. Please try again or contact support if the issue persists.",
};

interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

const ErrorPage = ({ error, reset }: ErrorPageProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br text-center p-6 animate-fadeIn">
      <FiAlertTriangle size={50} className="text-red-600 mb-4 animate-bounce" />
      <h1 className="text-3xl font-extrabold text-red-600 shadow-lg mb-2">
        Oops! Something went wrong.
      </h1>
      <p className="text-md text-red-500 mt-2 mb-6 max-w-md">{error.message}</p>
      <Button
        onClick={reset}
        className="mt-4 px-6 py-3 text-white bg-red-600 rounded-full hover:bg-red-700 shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
      >
        Try Again
      </Button>
    </div>
  );
};

export default ErrorPage;
