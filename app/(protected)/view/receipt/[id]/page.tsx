import PaymentReceipt from "@/components/payments/receipt";
import { Payment } from "@/types";
import { cookies } from "next/headers";
import type { Metadata } from "next";

async function fetchPaymentReceipt(paymentId: string): Promise<Payment> {
  const getCookie = async (name: string) => {
    return cookies().get(name)?.value ?? "";
  };

  const sessionTokenAuthJs = await getCookie("authjs.session-token");
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payments/get/${paymentId}`;

  const res = await fetch(apiUrl, {
    method: "GET",
    headers: {
      Cookie: `authjs.session-token=${sessionTokenAuthJs}`,
    },
  });

  const data = await res.json().catch(() => {
    throw new Error(
      "An error occurred while processing your request. Please try again."
    );
  });

  if (!res.ok) {
    throw new Error(data.error || "Unknown error occurred");
  }

  return data;
}

//https://nextjs.org/docs/app/building-your-application/optimizing/metadata`
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const paymentId = params.id;
  const receipt = await fetchPaymentReceipt(paymentId);

  return {
    title: `Receipt #${receipt.paymentNumber} - ${receipt.customerName}`,
    description: `View the receipt for payment #${receipt.paymentNumber} made by ${receipt.customerCompanyName}.`,
  };
}

const ViewReceiptPage = async ({ params }: { params: { id: string } }) => {
  const paymentId = params.id;
  const receipt = await fetchPaymentReceipt(paymentId);
  const paymentData: Payment = receipt;

  return <PaymentReceipt payment={paymentData} />;
};

export default ViewReceiptPage;
