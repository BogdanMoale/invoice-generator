"use client";

import React, { useRef } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useReactToPrint } from "react-to-print";
import { InvoiceTemplateModelProps } from "@/types";
import { FiDownload } from "react-icons/fi";

const InvoiceTemplateModel2: React.FC<InvoiceTemplateModelProps> = ({
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
  currencySymbol,
}) => {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Invoice_${invoiceNumber}`,
  });

  return (
    <Card ref={componentRef} className="w-full max-w-lg mx-auto">
      <CardContent className="p-6">
        <div className="grid gap-4">
          {/* Header Section */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col leading-none">
              <h1 className="font-bold text-2xl">Invoice</h1>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                #{invoiceNumber} -{" "}
                <span className="font-normal">{customerName}</span>
                <span className="font-normal"> on {invoiceDate}</span>
              </div>
            </div>
            {/* Invoice Details */}
            <div className="ml-auto text-right">
              <dl className="grid gap-1 text-sm">
                <div className="grid gap-1">
                  <dt className="inline font-medium">Due Date</dt>
                  <dd className="inline text-gray-500 dark:text-gray-400">
                    {dueDate}
                  </dd>
                </div>
                <div className="grid gap-1">
                  <dt className="inline font-medium">Status</dt>
                  <dd className="inline text-gray-500 dark:text-gray-400">
                    {paymentStatus}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-800" />

          {/* Sender and Recipient Details */}
          <div className="grid gap-4">
            <div className="grid gap-1">
              <h2 className="font-semibold">{userCompanyName}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {userEmail}
                <br />
                {userName}
              </p>
            </div>
            <div className="grid gap-1">
              <h2 className="font-semibold">To</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {customerName}
                <br />
                {customerCompanyName}
                <br />
                {customerEmail}
                <br />
                {customerAddress}
              </p>
            </div>
          </div>

          {/* Invoice Items Table */}
          <div className="border border-gray-200 rounded-lg dark:border-gray-800">
            <Table>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {item.itemName}
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      {currencySymbol + item.unitPrice.toFixed(2)}
                    </TableCell>
                    <TableCell>{`${item.tax.toFixed(2)}%`}</TableCell>
                    <TableCell>
                      {currencySymbol + item.totalTax.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {currencySymbol + item.total.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Totals Section */}
          <div className="grid gap-4">
            <div className="flex items-center">
              <div>Subtotal</div>
              <div className="ml-auto">
                {currencySymbol + subtotal.toFixed(2)}
              </div>
            </div>
            <div className="flex items-center">
              <div>Total Tax</div>
              <div className="ml-auto">
                {currencySymbol + taxAmount.toFixed(2)}
              </div>
            </div>
            <div className="flex items-center">
              <div>Discount</div>
              <div className="ml-auto">
                {currencySymbol + discountAmount.toFixed(2)}
              </div>
            </div>
            <Separator />
            <div className="flex items-center font-medium">
              <div>Total Amount</div>
              <div className="ml-auto">{currencySymbol + total.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Footer Section */}
      <CardFooter className="border-t p-6 justify-end">
        <Button className="no-print" onClick={handlePrint}>
          <FiDownload /> Download
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InvoiceTemplateModel2;
