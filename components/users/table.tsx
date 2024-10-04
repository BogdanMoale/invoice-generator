import { useEffect, useState } from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { User } from "@/types";
import { Modal } from "@/components/ui/modal";
import { UserForm } from "./form";
import { fetchApi } from "@/helpers/fetch-api";
import PaginationControls from "../pagination-controls";
import { DataTable } from "../data-table";
import UsersCardView from "./card-view";
import FilterInputs from "../filters";
import { getUserColumns } from "./users-columns";
import { useCurrentUser } from "@/hooks/use-current-user";

interface UsersTableProps {
  data: User[];
  handleUserDeleted: (userId: string) => void;
  handleUserUpdated: (updatedUser: User) => void;
  currentPage: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export function UsersTable({
  data,
  handleUserDeleted,
  handleUserUpdated,
  currentPage,
  totalCount,
  onPageChange,
}: UsersTableProps) {
  const [nameFilter, setNameFilter] = useState<string>("");
  const [emailFilter, setEmailFilter] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    name: true,
    email: true,
    role: true,
    companyName: false,
  });
  const [rowSelection, setRowSelection] = useState({});
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined);

  const router = useRouter();
  const currentUser = useCurrentUser();

  const deleteUserHandler = async (userId: string) => {
    await fetchApi(`/api/users/delete/${userId}`, {
      method: "DELETE",
    });

    handleUserDeleted(userId);
  };

  const fetchUserById = async (userId: string) => {
    const data = await fetchApi(`/api/users/get/${userId}`, {});

    setEditingUser(data);
    setIsModalOpen(true);
  };

  const filters = [
    {
      id: "nameFilter",
      name: "nameFilter",
      value: nameFilter,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setNameFilter(e.target.value),
      placeholder: "Name...",
    },
    {
      id: "emailFilter",
      name: "emailFilter",
      value: emailFilter,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setEmailFilter(e.target.value),
      placeholder: "Email...",
    },
  ];

  const columns = getUserColumns({
    deletingUserId,
    currentUser,
    setDeletingUserId,
    fetchUserById,
    deleteUserHandler,
  });

  useEffect(() => {
    setColumnFilters([
      { id: "name", value: nameFilter },
      { id: "email", value: emailFilter },
    ]);
  }, [nameFilter, emailFilter]);

  const filteredData = data.filter((user) => {
    const matchesName = (user.name ?? "")
      .toLowerCase()
      .includes(nameFilter.toLowerCase());
    const matchesEmail = (user.email ?? "")
      .toLowerCase()
      .includes(emailFilter.toLowerCase());

    return matchesName && matchesEmail;
  });

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleUserCreated = (updatedUser: User) => {
    setEditingUser(undefined);
    setIsModalOpen(false);
    handleUserUpdated(updatedUser);
  };

  return (
    <div className="w-full">
      {/* Filter Inputs */}
      <FilterInputs
        filters={filters}
        columns={table.getAllColumns()}
        table={table}
      ></FilterInputs>

      {/* User Table Larger Screens */}
      <DataTable
        table={table}
        columns={columns}
        noDataMessage="No users found."
      />

      {/* Mobile Card Layout */}
      <UsersCardView
        filteredData={filteredData}
        deletingUserId={deletingUserId}
        setDeletingUserId={setDeletingUserId}
        fetchUserById={fetchUserById}
        deleteUserHandler={deleteUserHandler}
        currentUser={currentUser}
      />

      {/* Pagination Controls */}
      <PaginationControls
        currentPage={currentPage}
        totalCount={totalCount}
        onPageChange={onPageChange}
      />

      {/* User Form Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <UserForm
          onClose={() => setIsModalOpen(false)}
          onUserCreated={handleUserCreated}
          user={editingUser}
        />
      </Modal>
    </div>
  );
}
