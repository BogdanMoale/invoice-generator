import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import Header from "@/components/header/header";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = async ({ children }: ProtectedLayoutProps) => {
  const currentSession = await auth();
  return (
    <div className="max-w-screen-xl  min-h-[calc(100vh-4.5rem)] p-6 mx-auto flex flex-col">
      <SessionProvider session={currentSession}>
        <Header></Header>
        {children}
        <Toaster />
      </SessionProvider>
    </div>
  );
};

export default ProtectedLayout;
