import { useEffect, useState } from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Payment } from "@/types";
import { Modal } from "@/components/ui/modal";
import { useRouter } from "next/navigation";
import { PaymentForm } from "./payments-form";
import { fetchApi } from "@/helpers/fetch-api";
import PaginationControls from "../pagination-controls";
import { DataTable } from "../data-table";
import PaymentsCardView from "./card-view";
import FilterInputs from "../filters";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getPaymentColumns } from "./payments-columns";

interface PaymentsTableProps {
  data: Payment[];
  handlePaymentDeleted: (paymentId: string) => void;
  handlePaymentUpdated: (updatedPayment: Payment) => void;
  currentPage: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export function PaymentsTable({
  data,
  handlePaymentDeleted,
  handlePaymentUpdated,
  currentPage,
  totalCount,
  onPageChange,
}: PaymentsTableProps) {
  const [invoiceFilter, setInvoiceFilter] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    invoiceNo: true,
    amount: true,
    method: true,
    status: true,
    paymentDate: true,
  });
  const [rowSelection, setRowSelection] = useState({});
  const [deletingPaymentId, setDeletingPaymentId] = useState<string | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | undefined>(
    undefined
  );

  const router = useRouter();
  const currentUser = useCurrentUser();

  const deletePaymentHandler = async (paymentId: string) => {
    await fetchApi(`/api/payments/delete/${paymentId}`, {
      method: "DELETE",
    });

    handlePaymentDeleted(paymentId);
  };

  const fetchPaymentById = async (paymentId: string) => {
    const data = await fetchApi(`/api/payments/get/${paymentId}`);

    setEditingPayment(data);
    setIsModalOpen(true);
  };

  const filters = [
    {
      id: "invoice-filter",
      name: "invoice-filter",
      value: invoiceFilter,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setInvoiceFilter(e.target.value),
      placeholder: "Invoice No...",
    },
  ];

  const columns = getPaymentColumns({
    router,
    currentUser,
    fetchPaymentById,
    deletePaymentHandler,
    deletingPaymentId,
    setDeletingPaymentId,
  });
  useEffect(() => {
    setColumnFilters([{ id: "invoiceNumber", value: invoiceFilter }]);
  }, [invoiceFilter]);

  const filteredData = data.filter((payment) =>
    payment.invoice?.invoiceNumber
      .toLowerCase()
      .includes(invoiceFilter.toLowerCase())
  );

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handlePaymentCreated = (updatedPayment: Payment) => {
    setEditingPayment(undefined);
    setIsModalOpen(false);
    handlePaymentUpdated(updatedPayment);
  };

  return (
    <div className="w-full">
      {/* Filter Inputs */}
      <FilterInputs filters={filters} columns={columns} table={table} />

      {/* Payments Table larger screen */}
      <DataTable
        table={table}
        columns={columns}
        noDataMessage="No payments found."
      />

      {/* Mobile Card Layout*/}
      <PaymentsCardView
        filteredData={filteredData}
        deletingPaymentId={deletingPaymentId}
        setDeletingPaymentId={setDeletingPaymentId}
        fetchPaymentById={fetchPaymentById}
        deletePaymentHandler={deletePaymentHandler}
        router={router}
        currentUser={currentUser}
      />

      {/* Pagination Controls */}
      <PaginationControls
        currentPage={currentPage}
        totalCount={totalCount}
        onPageChange={onPageChange}
      />

      {/* Payment Form Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <PaymentForm
          onClose={() => setIsModalOpen(false)}
          onPaymentCreated={handlePaymentCreated}
          payment={editingPayment}
        />
      </Modal>
    </div>
  );
}
