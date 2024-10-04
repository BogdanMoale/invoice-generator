"use client";

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
import { Modal } from "@/components/ui/modal";
import { UpdateCustomerForm } from "@/components/customers/update-customer-form";
import { Customer } from "@/types";
import { useCurrentUser } from "@/hooks/use-current-user";
import { fetchApi } from "@/helpers/fetch-api";
import PaginationControls from "../pagination-controls";
import { DataTable } from "../data-table";
import CustomersCardView from "./card-view";
import FilterInputs from "../filters";
import { getCustomerColumns } from "./customers-columns";

interface CustomerTableProps {
  data: Customer[];
  handleCustomerDeleted: (customerId: string) => void;
  handleCustomerUpdated: (updatedCustomer: Customer) => void;
  currentPage: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export function CustomerTable({
  data,
  handleCustomerDeleted,
  handleCustomerUpdated,
  currentPage,
  totalCount,
  onPageChange,
}: CustomerTableProps) {
  const [nameFilter, setNameFilter] = useState<string>("");
  const [emailFilter, setEmailFilter] = useState<string>("");
  const currentUser = useCurrentUser();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    name: true,
    email: true,
    companyName: true,
    phone: false,
    address: false,
  });
  const [rowSelection, setRowSelection] = useState({});
  const [deletingCustomerId, setDeletingCustomerId] = useState<string | null>(
    null
  );
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingCustomer(null);
    setIsModalOpen(false);
  };

  const handleCustomerUpdatedInternal = (updatedCustomer: Customer) => {
    handleCustomerUpdated(updatedCustomer);
    handleCloseModal();
  };

  const handleCustomerDeletedInternal = (customerId: string) => {
    handleCustomerDeleted(customerId);
  };
  const filters = [
    {
      id: "nameFilter",
      name: "nameFilter",
      value: nameFilter,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setNameFilter(e.target.value),
      placeholder: "Name...",
    },
    {
      id: "emailFilter",
      name: "emailFilter",
      value: emailFilter,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setEmailFilter(e.target.value),
      placeholder: "Email...",
    },
  ];

  async function onCustomerDeletedHandler() {
    if (deletingCustomerId) {
      await fetchApi(`/api/customers/delete/${deletingCustomerId}`, {
        method: "DELETE",
      });
      handleCustomerDeletedInternal(deletingCustomerId);
      setDeletingCustomerId(null);
    }
  }

  const columns = getCustomerColumns({
    currentUser,
    deletingCustomerId,
    setDeletingCustomerId,
    handleEditCustomer,
    onCustomerDeletedHandler,
  });

  useEffect(() => {
    setColumnFilters([
      { id: "name", value: nameFilter },
      { id: "email", value: emailFilter },
    ]);
  }, [nameFilter, emailFilter]);

  const filteredData = data.filter((customer) => {
    const matchesName = customer.name
      .toLowerCase()
      .includes(nameFilter.toLowerCase());
    const matchesEmail = customer.email
      .toLowerCase()
      .includes(emailFilter.toLowerCase());

    return matchesName && matchesEmail;
  });

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

  return (
    <div className="w-full">
      {/* Conditionally render the UpdateCustomerForm inside the Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {isModalOpen && editingCustomer && (
          <UpdateCustomerForm
            initialData={editingCustomer}
            onClose={handleCloseModal}
            onCustomerUpdated={handleCustomerUpdatedInternal}
          />
        )}
      </Modal>

      {/* Filter Inputs */}
      <FilterInputs filters={filters} columns={columns} table={table} />

      {/* Customer Table Desktop view */}
      <DataTable
        table={table}
        columns={columns}
        noDataMessage="No customers found."
      />

      {/* Card layout for mobile */}
      <CustomersCardView
        filteredData={filteredData}
        currentUser={currentUser}
        handleEditCustomer={handleEditCustomer}
        onCustomerDeletedHandler={onCustomerDeletedHandler}
        deletingCustomerId={deletingCustomerId}
        setDeletingCustomerId={setDeletingCustomerId}
      />

      {/* Pagination Controls */}
      <PaginationControls
        currentPage={currentPage}
        totalCount={totalCount}
        onPageChange={onPageChange}
      />
    </div>
  );
}
