import MobileCard from "../ui/mobile-card";
import Actions from "../form/form-actions";
import { useRouter } from "next/navigation";
import StatusIndicator from "../payments/status-indicator";
import { Invoice, Customer } from "@prisma/client";

interface InvoiceWithCustomer extends Invoice {
  customer: Customer | null;
}

interface InvoiceCardViewProps {
  filteredData: InvoiceWithCustomer[];
  currentUser: { role: string } | undefined;
  fetchInvoiceById: (id: string) => void;
  deleteInvoiceHandler: (id: string) => void;
  deletingInvoiceId: string | null;
  setDeletingInvoiceId: (id: string | null) => void;
}

const InvoiceCardView: React.FC<InvoiceCardViewProps> = ({
  filteredData,
  currentUser,
  fetchInvoiceById,
  deleteInvoiceHandler,
  deletingInvoiceId,
  setDeletingInvoiceId,
}) => {
  const router = useRouter();

  return (
    <div className="sm:hidden grid gap-4">
      {filteredData.map((invoice) => (
        <MobileCard
          key={invoice.id}
          title={invoice.invoiceNumber}
          content={
            <>
              <div>
                <strong>Customer:</strong>{" "}
                {currentUser?.role === "CUSTOMER"
                  ? invoice.userCompanyName || "N/A"
                  : invoice.customer?.companyName ||
                    invoice.customerCompanyName ||
                    "N/A"}
              </div>
              <div>
                <strong>Total:</strong> {invoice.currencySymbol || "$"}
                {invoice.total.toFixed(2)}
              </div>
              <div className="flex justify-center items-center mb-2">
                {invoice.paymentStatus === "PAID" && (
                  <StatusIndicator status="Paid" />
                )}
                {invoice.paymentStatus === "PARTIALLY_PAID" && (
                  <StatusIndicator status="Partially Paid" />
                )}
                {invoice.paymentStatus === "PENDING" && (
                  <StatusIndicator status="Pending" />
                )}
                {invoice.paymentStatus === "UNPAID" && (
                  <StatusIndicator status="Unpaid" />
                )}
              </div>
            </>
          }
          footer={
            <Actions
              id={invoice.id}
              status={invoice.paymentStatus}
              onPreview={() => router.push(`/view/invoice/${invoice.id}`)}
              onEdit={() => fetchInvoiceById(invoice.id)}
              onDelete={() => deleteInvoiceHandler(invoice.id)}
              deletingId={deletingInvoiceId}
              setDeletingId={setDeletingInvoiceId}
              currentUser={currentUser}
            />
          }
        />
      ))}
    </div>
  );
};

export default InvoiceCardView;
