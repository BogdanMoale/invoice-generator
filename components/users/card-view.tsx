import MobileCard from "../ui/mobile-card";
import Actions from "../form/form-actions";
import UserRole from "../users/user-role";
import { User } from "@/types";

interface UsersCardViewProps {
  filteredData: User[];
  currentUser: { role: string } | undefined;
  deletingUserId: string | null;
  setDeletingUserId: (id: string | null) => void;
  fetchUserById: (id: string) => void;
  deleteUserHandler: (id: string) => void;
}

const UsersCardView: React.FC<UsersCardViewProps> = ({
  filteredData,
  currentUser,
  deletingUserId,
  setDeletingUserId,
  fetchUserById,
  deleteUserHandler,
}) => {
  return (
    <div className="sm:hidden grid gap-4">
      {filteredData.map((user) => (
        <MobileCard
          key={user.id}
          title={user.name ?? "No Name"}
          content={
            <>
              <div>
                <strong>Email:</strong> {user.email}
              </div>
              <div>
                <UserRole role={user.role} />
              </div>
              <div>
                <strong>Company:</strong> {user.companyName || "N/A"}
              </div>
            </>
          }
          footer={
            <Actions
              id={user.id}
              onEdit={() => fetchUserById(user.id)}
              onDelete={() => deleteUserHandler(user.id)}
              deletingId={deletingUserId}
              setDeletingId={setDeletingUserId}
              currentUser={currentUser}
            />
          }
        />
      ))}
    </div>
  );
};

export default UsersCardView;
