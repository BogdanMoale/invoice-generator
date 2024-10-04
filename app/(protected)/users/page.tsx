import { Suspense } from "react";
import { User } from "@/types";
import { Spinner } from "@nextui-org/spinner";
import Users from "@/components/users/users";
import { cookies } from "next/headers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users",
  description:
    "Manage users effortlessly with our Invoiceraptor application. Add, edit, and assign roles to users to ensure efficient team collaboration and secure access control.",
};

const UsersPage = async ({
  searchParams,
}: {
  searchParams: { page?: string };
}) => {
  const getCookie = async (name: string) => {
    return cookies().get(name)?.value ?? "";
  };

  const sessionTokenAuthJs = await getCookie("authjs.session-token");

  const currentPage = searchParams.page ? parseInt(searchParams.page) : 0;
  const skip = currentPage * 10;
  const take = 10;

  let initialUsers: User[] = [];
  let totalCount: number = 0;

  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/get/?skip=${skip}&take=${take}`;
    const res = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Cookie: `authjs.session-token=${sessionTokenAuthJs}`,
      },
      // cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch users`);
    }

    const data = await res.json();
    initialUsers = data.users;
    totalCount = data.totalCount;
  } catch (error) {
    throw new Error("Error fetching users");
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <Spinner size="sm" label="Loading" color="success" />
        </div>
      }
    >
      <Users
        users={initialUsers}
        totalCount={totalCount}
        currentPage={currentPage}
      />
    </Suspense>
  );
};

export default UsersPage;
