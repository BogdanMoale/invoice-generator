import { Suspense } from "react";
import { Invoice, Customer } from "@prisma/client";
import { Spinner } from "@nextui-org/spinner";
import Invoices from "@/components/invoices/invoices";
import { cookies } from "next/headers";
import { headers } from "next/headers";
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
    // Try production cookie name first (with _Secure- prefix)
    const secureCookie = cookies().get(`_Secure-${name}`);
    if (secureCookie?.value) return secureCookie.value;

    // Fallback to development cookie name
    return cookies().get(name)?.value ?? "";
  };

  const sessionTokenAuthJs = await getCookie("authjs.session-token");

  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;
  const skip = (currentPage - 1) * 10;
  const take = 10;

  let initialInvoices: InvoiceWithCustomer[] = [];
  let totalCount: number = 0;

  try {
    // Get the host from headers
    const headersList = headers();
    const host = headersList.get("host") || "";
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

    // Construct the API URL using the current host
    const apiUrl = `${protocol}://${host}/api/invoices/get/?skip=${skip}&take=${take}`;

    const res = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Cookie: `_Secure-authjs.session-token=${sessionTokenAuthJs}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Error response:", errorText);
      throw new Error(
        `Failed to fetch invoices: ${res.status} ${res.statusText}`
      );
    }

    const data = await res.json();
    initialInvoices = data.invoices;
    totalCount = data.totalCount;
  } catch (error) {
    console.error("Error in try-catch block:", error);
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
