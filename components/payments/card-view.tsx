import MobileCard from "../ui/mobile-card";
import Actions from "../form/form-actions";
import StatusIndicator from "../payments/status-indicator";
import { Payment } from "@/types";

interface PaymentsCardViewProps {
  filteredData: Payment[];
  currentUser: { role: string } | undefined;
  deletingPaymentId: string | null;
  setDeletingPaymentId: (id: string | null) => void;
  fetchPaymentById: (id: string) => void;
  deletePaymentHandler: (id: string) => void;
  router: any;
}

const PaymentsCardView: React.FC<PaymentsCardViewProps> = ({
  filteredData,
  currentUser,
  deletingPaymentId,
  setDeletingPaymentId,
  fetchPaymentById,
  deletePaymentHandler,
  router,
}) => {
  return (
    <div className="sm:hidden grid gap-4">
      {filteredData.map((payment) => (
        <MobileCard
          key={payment.id}
          title={payment.invoice.invoiceNumber}
          content={
            <>
              <div>
                <strong>Total:</strong> {payment.invoice.currencySymbol}
                {payment.totalAmount.toFixed(2)}
              </div>
              <div>
                <strong>Paid:</strong> {payment.invoice.currencySymbol}
                {payment.amountPaid.toFixed(2)}
              </div>
              <div>
                <strong>Left to Pay:</strong> {payment.invoice.currencySymbol}
                {payment.leftToPay.toFixed(2)}
              </div>
              <div>
                <strong>Method:</strong> {payment.method}
              </div>
              <div className="flex justify-center items-center mb-2">
                {payment.status === "PAID" && <StatusIndicator status="Paid" />}
                {payment.status === "PARTIALLY_PAID" && (
                  <StatusIndicator status="Partially Paid" />
                )}
                {payment.status === "PENDING" && (
                  <StatusIndicator status="Pending" />
                )}
                {payment.status === "UNPAID" && (
                  <StatusIndicator status="Unpaid" />
                )}
              </div>
            </>
          }
          footer={
            <Actions
              id={payment.id}
              status={payment.status}
              onPreview={() => router.push(`/view/receipt/${payment.id}`)}
              onEdit={
                payment.status !== "PAID"
                  ? () => fetchPaymentById(payment.id)
                  : undefined
              }
              onDelete={() => deletePaymentHandler(payment.id)}
              deletingId={deletingPaymentId}
              setDeletingId={setDeletingPaymentId}
              currentUser={currentUser}
            />
          }
        />
      ))}
    </div>
  );
};

export default PaymentsCardView;
