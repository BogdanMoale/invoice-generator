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
import { Invoice, Customer } from "@prisma/client";
import { InvoiceForm } from "./invoice-form";
import { Modal } from "@/components/ui/modal";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";
import { fetchApi } from "@/helpers/fetch-api";
import PaginationControls from "../pagination-controls";
import { DataTable } from "../data-table";
import InvoiceCardView from "./card-view";
import FilterInputs from "../filters";
import { getInvoiceColumns } from "./invoice-columns";

interface InvoiceWithCustomer extends Invoice {
  customer: Customer | null;
}

interface InvoicesTableProps {
  data: InvoiceWithCustomer[];
  handleInvoiceDeleted: (invoiceId: string) => void;
  handleInvoiceUpdated: (updatedInvoice: InvoiceWithCustomer) => void;
  currentPage: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export function InvoicesTable({
  data,
  handleInvoiceDeleted,
  handleInvoiceUpdated,
  currentPage,
  totalCount,
  onPageChange,
}: InvoicesTableProps) {
  const [invoiceNumberFilter, setInvoiceNumberFilter] = useState<string>("");
  const [customerFilter, setCustomerFilter] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    invoiceNumber: true,
    customer: true,
    invoiceDate: false,
    dueDate: false,
    total: true,
    status: true,
  });
  const [rowSelection, setRowSelection] = useState({});
  const [deletingInvoiceId, setDeletingInvoiceId] = useState<string | null>(
    null
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] =
    useState<InvoiceWithCustomer | null>(null);

  const router = useRouter();
  const currentUser = useCurrentUser();

  const deleteInvoiceHandler = async (invoiceId: string) => {
    await fetchApi(`/api/invoices/delete/${invoiceId}`, {
      method: "DELETE",
    });

    handleInvoiceDeleted(invoiceId);
  };

  const fetchInvoiceById = async (invoiceId: string) => {
    const data = await fetchApi(`/api/invoices/get/${invoiceId}`);

    setEditingInvoice(data);
    setIsModalOpen(true);
  };

  const filters = [
    {
      id: "invoiceNumberFilter",
      name: "invoiceNumberFilter",
      value: invoiceNumberFilter,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setInvoiceNumberFilter(e.target.value),
      placeholder: "Invoice no...",
    },
    {
      id: "customerFilter",
      name: "customerFilter",
      value: customerFilter,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setCustomerFilter(e.target.value),
      placeholder: "Customer...",
    },
  ];

  const columns = getInvoiceColumns({
    currentUser,
    fetchInvoiceById,
    deleteInvoiceHandler,
    router,
    deletingInvoiceId,
    setDeletingInvoiceId,
  });

  // Filter logic for card view based on invoiceNumber and customer filters
  const filteredData = data.filter((invoice) => {
    const matchesInvoiceNumber = invoice.invoiceNumber
      .toLowerCase()
      .includes(invoiceNumberFilter.toLowerCase());
    const matchesCustomer =
      invoice.customer && invoice.customer.companyName
        ? invoice.customer.companyName
            .toLowerCase()
            .includes(customerFilter.toLowerCase())
        : true;

    return matchesInvoiceNumber && matchesCustomer;
  });

  useEffect(() => {
    setColumnFilters([
      { id: "invoiceNumber", value: invoiceNumberFilter },
      { id: "customer", value: customerFilter },
    ]);
  }, [invoiceNumberFilter, customerFilter]);

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

  const handleInvoiceCreated = (updatedInvoice: InvoiceWithCustomer) => {
    setEditingInvoice(null);
    setIsModalOpen(false);
    handleInvoiceUpdated(updatedInvoice);
  };

  return (
    <div className="w-full">
      {/* Filter Inputs */}
      <FilterInputs
        filters={filters}
        columns={table.getAllColumns()}
        table={table}
      ></FilterInputs>

      {/* Invoice Table large screen */}
      <DataTable
        table={table}
        columns={columns}
        noDataMessage="No invoices found."
      />

      {/* Invoice Card Layout for Mobile */}
      <InvoiceCardView
        filteredData={filteredData}
        currentUser={currentUser}
        fetchInvoiceById={fetchInvoiceById}
        deleteInvoiceHandler={deleteInvoiceHandler}
        deletingInvoiceId={deletingInvoiceId}
        setDeletingInvoiceId={setDeletingInvoiceId}
      />

      {/* Pagination Controls */}
      <PaginationControls
        currentPage={currentPage}
        totalCount={totalCount}
        onPageChange={onPageChange}
      />

      {/* Invoice Form Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <InvoiceForm
          onClose={() => setIsModalOpen(false)}
          onInvoiceCreated={handleInvoiceCreated}
          invoice={editingInvoice}
        />
      </Modal>
    </div>
  );
}
