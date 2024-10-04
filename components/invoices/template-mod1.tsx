"use client";

import React, { useRef } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableHeader,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useReactToPrint } from "react-to-print";
import { InvoiceTemplateModelProps } from "@/types";
import { FiDownload } from "react-icons/fi";

const InvoiceTemplateModel1: React.FC<InvoiceTemplateModelProps> = ({
  invoiceNumber,
  invoiceDate,
  dueDate,
  userName,
  userCompanyName,
  userEmail,
  customerName,
  customerCompanyName,
  customerEmail,
  customerAddress,
  items,
  subtotal,
  taxAmount,
  discountAmount,
  total,
  paymentStatus,
  description,
  currencySymbol,
}) => {
  // Reference to the invoice content
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
    documentTitle: `Invoice_${invoiceNumber}`,
  });

  return (
    <Card ref={invoiceRef} className="mx-auto max-w-3xl">
      {/* Header Section */}
      <CardHeader className="flex flex-col items-center gap-2">
        <div className="text-center">
          <CardTitle className="text-xl font-bold">Invoice</CardTitle>
          <CardDescription>
            Invoice #{invoiceNumber} for your recent order
          </CardDescription>
        </div>
        <div className="grid gap-1 text-sm">
          <div>{userCompanyName}</div>
          <div>{userEmail}</div>
          <div>{userName}</div>
        </div>
      </CardHeader>

      {/* Invoice Details */}
      <CardContent className="p-0">
        <div className="border-t border-b py-4 grid gap-2 px-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="font-medium">Invoice Number</div>
            <div className="text-gray-500 dark:text-gray-400">
              {invoiceNumber}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="font-medium">Issue Date</div>
            <div>{invoiceDate}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="font-medium">Due Date</div>
            <div>{dueDate}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="font-medium">Payment Status</div>
            <div>{paymentStatus}</div>
          </div>
        </div>

        {/* Bill To Section */}
        <div className="border-t grid gap-2 px-4 py-4 text-sm">
          <div className="font-medium">Bill to</div>
          <div className="grid gap-1 text-sm">
            <div>{customerName}</div>
            <div>{customerCompanyName}</div>
            <div>{customerEmail}</div>
            <div>{customerAddress}</div>
          </div>
        </div>

        {/* Invoice Items Table */}
        <div className="border-t">
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="text-left p-2">Name</TableHead>
                <TableHead className="text-left p-2">Quantity</TableHead>
                <TableHead className="text-left p-2">Price</TableHead>
                <TableHead className="text-left p-2">Tax%</TableHead>
                <TableHead className="text-left p-2">Tax Amount</TableHead>
                <TableHead className="text-left p-2">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="text-left p-2 font-medium">
                    {item.itemName}
                  </TableCell>
                  <TableCell className="text-left p-2">
                    {item.quantity}
                  </TableCell>
                  <TableCell className="text-left p-2">
                    {currencySymbol + item.unitPrice.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-left p-2">{`${item.tax.toFixed(
                    2
                  )}%`}</TableCell>
                  <TableCell className="text-left p-2">
                    {currencySymbol + item.totalTax.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-left p-2">
                    {currencySymbol + item.total.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Totals Section */}
        <div className="border-t border-b grid gap-2 px-4 py-4 text-sm">
          <div className="flex items-center gap-4">
            <div>Subtotal</div>
            <div>{currencySymbol + subtotal.toFixed(2)}</div>
          </div>
          <div className="flex items-center gap-4">
            <div>Total Tax</div>
            <div>{currencySymbol + taxAmount.toFixed(2)}</div>
          </div>
          <div className="flex items-center gap-4">
            <div>Discount</div>
            <div>{currencySymbol + discountAmount.toFixed(2)}</div>
          </div>
          <div className="flex items-center gap-4 font-semibold">
            <div>Total Amount</div>
            <div>{currencySymbol + total.toFixed(2)}</div>
          </div>
        </div>

        {/* Notes Section */}
        {description && (
          <div className="border-t grid gap-2 px-4 py-4 text-sm">
            <div className="font-medium">Notes:</div>
            <div>{description}</div>
          </div>
        )}
      </CardContent>

      {/* Footer Section */}
      <CardFooter className="flex justify-end p-3 no-print">
        <Button className="no-print" onClick={handlePrint}>
          <FiDownload /> Download
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InvoiceTemplateModel1;
