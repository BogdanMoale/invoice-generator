"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { CustomersForm } from "@/components/customers/customers-form";
import { VscNewFile } from "react-icons/vsc";
import { Customer } from "@/types";
import { CustomerTable } from "@/components/customers/customers-table";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";

interface CustomersProps {
  initialCustomers: Customer[];
  totalCount: number;
  currentPage: number;
}

const Customers = ({
  initialCustomers,
  totalCount,
  currentPage,
}: CustomersProps) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const currentUser = useCurrentUser();

  useEffect(() => {
    setCustomers(initialCustomers); // Set the customers to the new data from the server
  }, [initialCustomers]);

  const handleCustomerAdded = (newCustomer: Customer) => {
    setCustomers((prevCustomers) => [...prevCustomers, newCustomer]);
    router.refresh();
  };

  const handleCustomerDeleted = (customerId: string) => {
    setCustomers((prevCustomers) =>
      prevCustomers.filter((customer) => customer.id !== customerId)
    );
    router.refresh();
  };

  const handleCustomerUpdated = (updatedCustomer: Customer) => {
    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) =>
        customer.id === updatedCustomer.id ? updatedCustomer : customer
      )
    );
    router.refresh();
  };

  const handlePageChange = (newPage: number) => {
    router.push(`/customers?page=${newPage}`);
    router.refresh();
  };

  return (
    <div className="relative h-screen w-full">
      <div className="flex justify-end mb-4">
        {currentUser?.role === "USER" && (
          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2"
          >
            <VscNewFile />
            <span>New</span>
          </Button>
        )}
      </div>

      <CustomerTable
        data={customers}
        handleCustomerDeleted={handleCustomerDeleted}
        handleCustomerUpdated={handleCustomerUpdated}
        currentPage={currentPage}
        totalCount={totalCount}
        onPageChange={handlePageChange}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CustomersForm
          onClose={() => setIsModalOpen(false)}
          onCustomerAdded={handleCustomerAdded}
        />
      </Modal>
    </div>
  );
};

export default Customers;
