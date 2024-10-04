"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { TbUserPlus } from "react-icons/tb";
import { UsersTable } from "@/components/users/table";
import { User } from "@/types";
import { useRouter } from "next/navigation";
import { UserForm } from "@/components/users/form";

interface UsersProps {
  users: User[];
  currentPage: number;
  totalCount: number;
}

const Users = ({
  users: initialUsers,
  totalCount,
  currentPage,
}: UsersProps) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>(initialUsers);

  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  const handleUserCreated = (newUser: User) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
    router.refresh();
  };

  const handleUserDeleted = (userId: string) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    router.refresh();
  };

  const handleUserUpdated = (updatedUser: User) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
    router.refresh();
  };

  const handlePageChange = (newPage: number) => {
    router.push(`/users?page=${newPage}`);
    router.refresh();
  };

  return (
    <div className="relative h-screen w-full">
      <div className="flex justify-end mb-4">
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2"
        >
          <TbUserPlus />
          <span>New</span>
        </Button>
      </div>

      <UsersTable
        data={users}
        handleUserDeleted={handleUserDeleted}
        handleUserUpdated={handleUserUpdated}
        currentPage={currentPage}
        totalCount={totalCount}
        onPageChange={handlePageChange}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <UserForm
          onClose={() => setIsModalOpen(false)}
          onUserCreated={handleUserCreated}
        />
      </Modal>
    </div>
  );
};

export default Users;
