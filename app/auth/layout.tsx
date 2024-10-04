import { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-full flex items-center justify-center bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-sky-600 via-blue-500 to-indigo-600">
      {children}
    </div>
  );
};

export default AuthLayout;
