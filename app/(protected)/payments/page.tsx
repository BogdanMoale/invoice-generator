import { Suspense } from "react";
import { Payment } from "@/types";
import { Spinner } from "@nextui-org/spinner";
import Payments from "@/components/payments/payments";
import { cookies } from "next/headers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payments",
  description:
    "Manage and track payments effortlessly with our Invoiceraptor application. Keep tabs on paid and pending invoices, and streamline your payment processing.",
};

const PaymentsPage = async ({
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

  let initialPayments: Payment[] = [];
  let totalCount: number = 0;

  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payments/get/?skip=${skip}&take=${take}`;
    const res = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Cookie: `authjs.session-token=${sessionTokenAuthJs}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch payments`);
    }

    const data = await res.json();
    initialPayments = data.payments;
    totalCount = data.totalCount;
  } catch (error) {
    throw new Error("Error fetching payments");
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <Spinner size="sm" label="Loading" color="success" />
        </div>
      }
    >
      <Payments
        payments={initialPayments}
        totalCount={totalCount}
        currentPage={currentPage}
      />
    </Suspense>
  );
};

export default PaymentsPage;
