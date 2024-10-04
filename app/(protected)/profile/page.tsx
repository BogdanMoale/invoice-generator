import { auth } from "@/auth";
import SettingsForm from "@/components/settings-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description:
    "Customize and manage your account settings effortlessly with our Invoiceraptor application. Update personal information, preferences, and streamline your invoicing workflow.",
};

const SettingsPage = async () => {
  // Fetch the session data server-side
  const session = await auth();

  return (
    <div className="w-full max-w-[600px] mx-auto">
      <SettingsForm session={session} />
    </div>
  );
};

export default SettingsPage;
