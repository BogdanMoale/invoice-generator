"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { TbCreditCard } from "react-icons/tb";
import { PaymentsTable } from "@/components/payments/payments-table";
import { Payment } from "@/types";
import { useRouter } from "next/navigation";
import { PaymentForm } from "./payments-form";
import { useCurrentUser } from "@/hooks/use-current-user";

interface PaymentsProps {
  payments: Payment[];
  currentPage: number;
  totalCount: number;
}

const Payments = ({
  payments: initialPayments,
  totalCount,
  currentPage,
}: PaymentsProps) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const currentUser = useCurrentUser();

  useEffect(() => {
    setPayments(initialPayments);
  }, [initialPayments]);

  const handlePaymentCreated = (newPayment: Payment) => {
    setPayments((prevPayments) => [...prevPayments, newPayment]);
    router.refresh();
  };

  const handlePaymentDeleted = (paymentId: string) => {
    setPayments((prevPayments) =>
      prevPayments.filter((payment) => payment.id !== paymentId)
    );
    router.refresh();
  };

  const handlePaymentUpdated = (updatedPayment: Payment) => {
    setPayments((prevPayments) =>
      prevPayments.map((payment) =>
        payment.id === updatedPayment.id ? updatedPayment : payment
      )
    );
    router.refresh();
  };

  const handlePageChange = (newPage: number) => {
    router.push(`/payments?page=${newPage}`);
    router.refresh();
  };

  return (
    <div className="relative h-screen w-full">
      <div className="flex justify-end mb-4">
        {(currentUser?.role === "USER" || currentUser?.role === "CUSTOMER") && (
          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2"
          >
            <TbCreditCard />
            <span>New</span>
          </Button>
        )}
      </div>

      <PaymentsTable
        data={payments}
        handlePaymentDeleted={handlePaymentDeleted}
        handlePaymentUpdated={handlePaymentUpdated}
        currentPage={currentPage}
        totalCount={totalCount}
        onPageChange={handlePageChange}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <PaymentForm
          onClose={() => setIsModalOpen(false)}
          onPaymentCreated={handlePaymentCreated}
        />
      </Modal>
    </div>
  );
};

export default Payments;
