"use client";

import { Payment } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useReactToPrint } from "react-to-print";
import { FiDownload } from "react-icons/fi";
import { useRef } from "react";
import { Separator } from "@/components/ui/separator";
import StatusIndicator from "./status-indicator";

interface PaymentReceiptProps {
  payment: Payment;
}

const PaymentReceipt: React.FC<PaymentReceiptProps> = ({ payment }) => {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Invoice_${payment.paymentNumber}`,
  });

  return (
    <Card ref={componentRef} className="w-full max-w-lg mx-auto">
      <CardContent className="p-6">
        {/* Header */}
        <div className="grid gap-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">Payment Receipt</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Invoice: {payment.invoice.invoiceNumber}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Payment: {payment.paymentNumber}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Payment Date:{" "}
                {new Date(payment.paymentDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Payment Method: {payment.method}
              </p>
            </div>
          </div>

          <Separator />

          {/* Customer Info */}
          <div className="grid gap-4">
            <div className="grid gap-1">
              <h2 className="font-semibold">Customer Information</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {payment.invoice.customerName}
                <br />
                {payment.invoice.customerEmail}
                <br />
                {payment.invoice.customerAddress}
              </p>
            </div>
          </div>

          <Separator />

          {/* Payment Details */}
          <h2 className="font-semibold mb-2">Payment Details</h2>
          <div className="grid gap-4">
            <div className="flex items-center">
              <div>Total Amount</div>
              <div className="ml-auto font-semibold">
                {`${
                  payment.invoice.currencySymbol
                }${payment.totalAmount.toFixed(2)}`}
              </div>
            </div>
            <div className="flex items-center">
              <div>Amount Paid</div>
              <div className="ml-auto font-semibold">
                {`${payment.invoice.currencySymbol}${payment.amountPaid.toFixed(
                  2
                )}`}
              </div>
            </div>
            <div className="flex items-center">
              <div>Left to Pay</div>
              <div className="ml-auto font-semibold">
                {`${payment.invoice.currencySymbol}${payment.leftToPay.toFixed(
                  2
                )}`}
              </div>
            </div>
            <div className="flex items-center">
              <div>Status</div>
              <div className="ml-auto font-semibold">
                {payment.status === "PAID" && (
                  <StatusIndicator status="Paid"></StatusIndicator>
                )}
                {payment.status === "PARTIALLY_PAID" && (
                  <StatusIndicator status="Proccesed"></StatusIndicator>
                )}

                {payment.status === "UNPAID" && (
                  <StatusIndicator status="Unpaid"></StatusIndicator>
                )}

                {payment.status === "PENDING" && (
                  <StatusIndicator status="Pending"></StatusIndicator>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Invoice Summary */}
          <h2 className="font-semibold mb-2">Invoice Summary</h2>
          <div className="grid gap-4">
            <div className="flex items-center">
              <div>Subtotal</div>
              <div className="ml-auto">
                {`${
                  payment.invoice.currencySymbol
                }${payment.invoice.subtotal.toFixed(2)}`}
              </div>
            </div>
            <div className="flex items-center">
              <div>Tax</div>
              <div className="ml-auto">
                {`${
                  payment.invoice.currencySymbol
                }${payment.invoice.taxAmount.toFixed(2)}`}
              </div>
            </div>
            <div className="flex items-center">
              <div>Discount</div>
              <div className="ml-auto">
                {`${
                  payment.invoice.currencySymbol
                }${payment.invoice.discountAmount.toFixed(2)}`}
              </div>
            </div>
            <div className="flex items-center font-medium">
              <div>Total</div>
              <div className="ml-auto">
                {`${
                  payment.invoice.currencySymbol
                }${payment.invoice.total.toFixed(2)}`}
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Footer with Print Button */}
      <CardFooter className="border-t p-6 justify-end">
        <Button className="no-print" onClick={handlePrint}>
          <FiDownload className="mr-2" /> Download
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentReceipt;
