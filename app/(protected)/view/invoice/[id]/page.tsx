import InvoiceTemplateModel1 from "@/components/invoices/template-mod1";
import InvoiceTemplateModel2 from "@/components/invoices/template-mod2";
import InvoiceTemplateModel3 from "@/components/invoices/template-mod3";
import { cookies } from "next/headers";
import { InvoiceTemplateModelProps } from "@/types";
import { formatDate } from "@/helpers/format-date";
import type { Metadata } from "next";

async function fetchInvoice(
  invoiceId: string
): Promise<InvoiceTemplateModelProps> {
  const getCookie = async (name: string) => {
    return cookies().get(name)?.value ?? "";
  };

  const sessionTokenAuthJs = await getCookie("authjs.session-token");
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/invoices/get/${invoiceId}`;

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
//https://nextjs.org/docs/app/building-your-application/optimizing/metadata
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const invoiceId = params.id;

  const invoice = await fetchInvoice(invoiceId);

  const itemsDescription = invoice.items
    .slice(0, 3)
    .map((item) => item.itemName)
    .join(", ");

  return {
    title: `Invoice #${invoice.invoiceNumber} - ${invoice.customerName}`,
    description: `View details of invoice #${invoice.invoiceNumber} for ${invoice.customerCompanyName} from ${invoice.userCompanyName}. Generated by ${invoice.userName}. Items: ${itemsDescription}.`,
  };
}

const ViewInvoicePage = async ({ params }: { params: { id: string } }) => {
  const invoiceId = params.id;

  const invoice = await fetchInvoice(invoiceId);

  const invoiceData = {
    invoiceNumber: invoice.invoiceNumber,
    invoiceDate: formatDate(invoice.invoiceDate),
    dueDate: formatDate(invoice.dueDate),
    userName: invoice.userName,
    userCompanyName: invoice.userCompanyName,
    userEmail: invoice.userEmail,
    customerName: invoice.customerName,
    customerCompanyName: invoice.customerCompanyName,
    customerEmail: invoice.customerEmail,
    customerAddress: invoice.customerAddress,
    items: invoice.items,
    subtotal: invoice.subtotal,
    taxAmount: invoice.taxAmount,
    discountAmount: invoice.discountAmount,
    total: invoice.total,
    paymentStatus: invoice.paymentStatus,
    description: invoice.description,
    currencySymbol: invoice.currencySymbol,
  };

  return (
    <div className="p-4">
      <InvoiceTemplateModel2 {...invoiceData} />
    </div>
  );
};

export default ViewInvoicePage;
