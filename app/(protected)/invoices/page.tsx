import { Suspense } from "react";
import { Invoice, Customer } from "@prisma/client";
import { Spinner } from "@nextui-org/spinner";
import Invoices from "@/components/invoices/invoices";
import { cookies } from "next/headers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invoices",
  description:
    "Create, manage, and track invoices seamlessly with our Invoiceraptor application. Streamline your invoicing process and stay on top of your payments.",
};

interface InvoiceWithCustomer extends Invoice {
  customer: Customer | null;
}

const InvoicesPage = async ({
  searchParams,
}: {
  searchParams: { page?: string };
}) => {
  const getCookie = async (name: string) => {
    return cookies().get(name)?.value ?? "";
  };

  const sessionTokenAuthJs = await getCookie("authjs.session-token");

  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;
  const skip = (currentPage - 1) * 10;
  const take = 10;

  let initialInvoices: InvoiceWithCustomer[] = [];
  let totalCount: number = 0;

  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/invoices/get/?skip=${skip}&take=${take}`;
    const res = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Cookie: `authjs.session-token=${sessionTokenAuthJs}`,
      },
      cache: "no-store", // Ensures data is fresh on each fetch
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch invoices`);
    }

    const data = await res.json();
    initialInvoices = data.invoices;
    totalCount = data.totalCount;
  } catch (error) {
    throw new Error("Error fetching invoices");
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <Spinner size="sm" label="Loading" color="success" />
        </div>
      }
    >
      <Invoices
        invoices={initialInvoices}
        totalCount={totalCount}
        currentPage={currentPage}
      />
    </Suspense>
  );
};

export default InvoicesPage;
