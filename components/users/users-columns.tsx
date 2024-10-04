import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import Actions from "@/components/form/form-actions";
import UserRole from "./user-role";

interface UserColumnsProps {
  deletingUserId: string | null;
  currentUser: { role: string } | undefined;
  setDeletingUserId: (id: string | null) => void;
  fetchUserById: (id: string) => void;
  deleteUserHandler: (id: string) => Promise<void>;
}

export const getUserColumns = ({
  deletingUserId,
  currentUser,
  setDeletingUserId,
  fetchUserById,
  deleteUserHandler,
}: UserColumnsProps): ColumnDef<User>[] => {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Role
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div>
          <UserRole role={row.getValue("role")}></UserRole>
        </div>
      ),
    },
    {
      accessorKey: "companyName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Company Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("companyName") || "N/A"}</div>,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original as User;

        const onEditUserHandler = () => {
          fetchUserById(user.id);
        };

        const onUserDeletedHandler = async () => {
          deleteUserHandler(user.id);
        };

        return (
          <Actions
            id={user.id}
            onEdit={onEditUserHandler}
            onDelete={onUserDeletedHandler}
            deletingId={deletingUserId}
            setDeletingId={setDeletingUserId}
            currentUser={currentUser}
          />
        );
      },
    },
  ];
};
