import { auth } from "@/auth";
import NavbarContent from "@/components/navbar/content";

const Navbar = async ({ user }: any) => {
  // Fetch session data server-side
  const session = await auth();
  return <NavbarContent user={session?.user} />;
};

export default Navbar;
