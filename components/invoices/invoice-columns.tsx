import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import StatusIndicator from "@/components/payments/status-indicator";
import Actions from "../form/form-actions";
import { Invoice, Customer } from "@prisma/client";
import { useRouter } from "next/navigation";

interface InvoiceWithCustomer extends Invoice {
  customer: Customer | null;
}

interface InvoiceColumnsProps {
  currentUser: { role: string } | undefined;
  fetchInvoiceById: (id: string) => void;
  deleteInvoiceHandler: (id: string) => void;
  router: ReturnType<typeof useRouter>;
  deletingInvoiceId: string | null;
  setDeletingInvoiceId: (id: string | null) => void;
}

export const getInvoiceColumns = ({
  currentUser,
  fetchInvoiceById,
  deleteInvoiceHandler,
  router,
  deletingInvoiceId,
  setDeletingInvoiceId,
}: InvoiceColumnsProps): ColumnDef<InvoiceWithCustomer>[] => [
  {
    accessorKey: "invoiceNumber",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Invoice Number
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("invoiceNumber")}</div>,
  },
  {
    accessorFn: (row) => {
      if (currentUser?.role === "CUSTOMER") {
        return row.userCompanyName || "N/A";
      }
      return row.customer?.companyName || row.customerCompanyName || "N/A";
    },
    id: "customer",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Customer
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>
        {currentUser?.role === "CUSTOMER"
          ? row.original.userCompanyName || "N/A"
          : row.original.customer?.companyName ||
            row.original.customerCompanyName ||
            "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "invoiceDate",
    header: "Invoice Date",
    cell: ({ row }) => (
      <div>{new Date(row.getValue("invoiceDate")).toLocaleDateString()}</div>
    ),
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ row }) => (
      <div>{new Date(row.getValue("dueDate")).toLocaleDateString()}</div>
    ),
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => {
      const total = row.getValue("total");
      const currencySymbol = row.original.currencySymbol || "$";
      return (
        <div>
          {currencySymbol}
          {total !== undefined && total !== null ? total.toString() : "N/A"}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.paymentStatus,
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");

      return (
        <div>
          {status === "PAID" && <StatusIndicator status="Paid" />}
          {status === "PARTIALLY_PAID" && (
            <StatusIndicator status="Partially Paid" />
          )}
          {status === "PENDING" && <StatusIndicator status="Pending" />}
          {status === "UNPAID" && <StatusIndicator status="Unpaid" />}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const invoice = row.original as InvoiceWithCustomer;

      const onEditInvoiceHandler = () => {
        fetchInvoiceById(invoice.id);
      };

      const onInvoiceDeletedHandler = async () => {
        deleteInvoiceHandler(invoice.id);
      };

      const onPreviewInvoiceHandler = () => {
        router.push(`/view/invoice/${invoice.id}`);
      };

      return (
        <Actions
          id={invoice.id}
          status={invoice.paymentStatus}
          onPreview={() => onPreviewInvoiceHandler()}
          onEdit={() => onEditInvoiceHandler()}
          onDelete={() => onInvoiceDeletedHandler()}
          deletingId={deletingInvoiceId}
          setDeletingId={setDeletingInvoiceId}
          currentUser={currentUser}
        />
      );
    },
  },
];
