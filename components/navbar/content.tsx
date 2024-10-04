import NavbarLinks from "./links";
import ThemeToggleButton from "./theme";

const Navbar = ({ user }: any) => {
  return (
    <nav className="w-full">
      <div className="max-w-screen-xl w-full flex items-center justify-between mx-auto py-4">
        <NavbarLinks user={user} />
        <ThemeToggleButton />
      </div>
    </nav>
  );
};

export default Navbar;
