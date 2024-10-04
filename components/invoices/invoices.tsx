"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { TbFileInvoice } from "react-icons/tb";
import { InvoicesTable } from "@/components/invoices/invoice-table";
import { InvoiceForm } from "@/components/invoices/invoice-form";
import { Invoice, Customer } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";

interface InvoiceWithCustomer extends Invoice {
  customer: Customer | null;
}

interface InvoicesProps {
  invoices: InvoiceWithCustomer[];
  currentPage: number;
  totalCount: number;
}

const Invoices = ({
  invoices: initialInvoices,
  totalCount,
  currentPage,
}: InvoicesProps) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invoices, setInvoices] =
    useState<InvoiceWithCustomer[]>(initialInvoices);
  const currentUser = useCurrentUser();

  useEffect(() => {
    setInvoices(initialInvoices); // Set the invoices to the new data from the server
  }, [initialInvoices]);

  const handleInvoiceCreated = (newInvoice: InvoiceWithCustomer) => {
    setInvoices((prevInvoices) => [...prevInvoices, newInvoice]);
    router.refresh();
  };

  const handleInvoiceDeleted = (invoiceId: string) => {
    setInvoices((prevInvoices) =>
      prevInvoices.filter((invoice) => invoice.id !== invoiceId)
    );
    router.refresh();
  };

  const handleInvoiceUpdated = (updatedInvoice: InvoiceWithCustomer) => {
    setInvoices((prevInvoices) =>
      prevInvoices.map((invoice) =>
        invoice.id === updatedInvoice.id ? updatedInvoice : invoice
      )
    );
    router.refresh();
  };

  const handlePageChange = (newPage: number) => {
    router.push(`/invoices?page=${newPage}`);
    router.refresh();
  };

  return (
    <div className="relative h-screen w-full">
      <div className="flex justify-end mb-4">
        {/* role logic */}
        {currentUser?.role === "USER" && (
          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2"
          >
            <TbFileInvoice />
            <span>New</span>
          </Button>
        )}
      </div>

      <InvoicesTable
        data={invoices}
        handleInvoiceDeleted={handleInvoiceDeleted}
        handleInvoiceUpdated={handleInvoiceUpdated}
        currentPage={currentPage}
        totalCount={totalCount}
        onPageChange={handlePageChange}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <InvoiceForm
          onClose={() => setIsModalOpen(false)}
          onInvoiceCreated={handleInvoiceCreated}
        />
      </Modal>
    </div>
  );
};

export default Invoices;
