import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import StatusIndicator from "@/components/payments/status-indicator";
import Actions from "@/components/form/form-actions";
import { Payment } from "@/types";
import { useRouter } from "next/navigation";

interface PaymentColumnsParams {
  router: ReturnType<typeof useRouter>;
  currentUser: { role: string } | undefined;
  fetchPaymentById: (id: string) => void;
  deletePaymentHandler: (id: string) => Promise<void>;
  deletingPaymentId: string | null;
  setDeletingPaymentId: (id: string | null) => void;
}

export function getPaymentColumns({
  router,
  currentUser,
  fetchPaymentById,
  deletePaymentHandler,
  deletingPaymentId,
  setDeletingPaymentId,
}: PaymentColumnsParams): ColumnDef<Payment>[] {
  return [
    {
      accessorFn: (row) => row.invoice.invoiceNumber, // Custom accessor to access nested field
      id: "invoiceNumber",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Invoice No
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.original.invoice.invoiceNumber}</div>,
      filterFn: (row, columnId, value) => {
        return row.original.invoice.invoiceNumber
          .toLowerCase()
          .includes(value.toLowerCase());
      },
    },
    {
      accessorFn: (row) => row.totalAmount,
      id: "totalAmount",
      header: "Total",
      cell: ({ row }) => (
        <div>{`${
          row.original.invoice.currencySymbol
        }${row.original.totalAmount.toFixed(2)}`}</div>
      ),
    },
    {
      accessorFn: (row) => row.amountPaid,
      id: "amountPaid",
      header: "Paid",
      cell: ({ row }) => (
        <div>{`${
          row.original.invoice.currencySymbol
        }${row.original.amountPaid.toFixed(2)}`}</div>
      ),
    },
    {
      accessorFn: (row) => row.leftToPay,
      id: "leftToPay",
      header: "Left to Pay",
      cell: ({ row }) => (
        <div>{`${
          row.original.invoice.currencySymbol
        }${row.original.leftToPay.toFixed(2)}`}</div>
      ),
    },
    {
      accessorFn: (row) => row.method,
      id: "method",
      header: "Method",
      cell: ({ row }) => <div>{row.getValue("method")}</div>,
    },
    {
      accessorFn: (row) => row.status,
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status");

        return (
          <div>
            {status === "PAID" && (
              <StatusIndicator status="Proccesed"></StatusIndicator>
            )}
            {status === "PARTIALLY_PAID" && (
              <StatusIndicator status="Proccesed"></StatusIndicator>
            )}
            {status === "PENDING" && (
              <StatusIndicator status="Pending"></StatusIndicator>
            )}
            {status === "UNPAID" && (
              <StatusIndicator status="Unpaid"></StatusIndicator>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const payment = row.original as Payment;

        const onEditPaymentHandler = () => {
          fetchPaymentById(payment.id);
        };

        const onPaymentDeletedHandler = async () => {
          await deletePaymentHandler(payment.id);
          router.refresh();
        };

        const onPreviewReceiptHandler = () => {
          router.push(`/view/receipt/${payment.id}`);
        };

        return (
          <Actions
            id={payment.id}
            status={payment.status}
            onPreview={onPreviewReceiptHandler}
            onEdit={
              payment.status !== "PAID" ? onEditPaymentHandler : undefined
            }
            onDelete={onPaymentDeletedHandler}
            deletingId={deletingPaymentId}
            setDeletingId={setDeletingPaymentId}
            currentUser={currentUser}
          />
        );
      },
    },
  ];
}
