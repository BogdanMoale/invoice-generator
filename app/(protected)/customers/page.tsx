import { cookies } from "next/headers";
import Customers from "@/components/customers/customers";
import { Customer } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customers",
  description:
    "Manage your customers effortlessly with our Invoiceraptor application. Add, edit, and track customer information to streamline your invoicing process.",
};

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const getCookie = async (name: string) => {
    return cookies().get(name)?.value ?? "";
  };

  const sessionTokenAuthJs = await getCookie("authjs.session-token");

  // Determine the current page, default to 0 if not specified(maybe change it to 1)
  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;
  const skip = (currentPage - 1) * 10;
  const take = 10;
  let initialCustomers: Customer[] = [];
  let totalCount: number = 0;

  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/customers/get?skip=${skip}&take=${take}`;
    const res = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Cookie: `authjs.session-token=${sessionTokenAuthJs}`,
      },
      cache: "no-store", // Ensures data is fresh on each fetch
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch customers`);
    }

    const data = await res.json();
    initialCustomers = data.customers;
    //console.log(data.customers);
    totalCount = data.totalCount;
  } catch (error) {
    throw new Error(`Failed to fetch customers`);
  }

  return (
    <Customers
      initialCustomers={initialCustomers}
      totalCount={totalCount}
      currentPage={currentPage}
    />
  );
}

// Fetch data directly from the database using Prisma(for reference)
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// const session = await auth();
// let customers: Customer[] = [];

// // const customers: Customer[] = await db.customer.findMany();
// if (!session || !session.user || !session.user.id) {
//   return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
// }

// try {
//   customers = await db.customer.findMany({
//     where: { userId: session.user.id },
//   });
// } catch (error) {}
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
