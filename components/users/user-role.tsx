import { FaUser, FaUserTie, FaUserSecret } from "react-icons/fa";

const UserRole: React.FC<{ role: string }> = ({ role }) => {
  const roleIconMap: { [key: string]: JSX.Element } = {
    ADMIN: <FaUserSecret className="text-green-500" />,
    USER: <FaUser className="text-blue-500" />,
    CUSTOMER: <FaUserTie className="text-orange-500" />,
  };

  return (
    <div className="flex items-center justify-center space-x-2 sm:justify-start">
      {roleIconMap[role]}
      <span>{role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}</span>
    </div>
  );
};

export default UserRole;
