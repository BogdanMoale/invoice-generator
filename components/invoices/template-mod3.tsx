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
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useReactToPrint } from "react-to-print";
import { FiDownload, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { InvoiceTemplateModelProps } from "@/types";

const InvoiceTemplateModel3: React.FC<InvoiceTemplateModelProps> = ({
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
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
    documentTitle: `Invoice_${invoiceNumber}`,
  });

  const statusIcon =
    paymentStatus.toLowerCase() === "paid" ? (
      <FiCheckCircle className="text-green-500 dark:text-green-400" />
    ) : (
      <FiXCircle className="text-red-500 dark:text-red-400" />
    );

  return (
    <Card
      ref={invoiceRef}
      className="mx-auto max-w-3xl shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
    >
      {/* Header Section */}
      <CardHeader className="flex flex-col items-center gap-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white p-6 rounded-t-xl">
        <div className="text-center">
          <CardTitle className="text-2xl font-extrabold">Invoice</CardTitle>
          <CardDescription className="text-white dark:text-gray-300">
            Invoice #{invoiceNumber} for your recent purchase
          </CardDescription>
        </div>
        <div className="grid gap-1 text-sm">
          <div>{userCompanyName}</div>
          <div>{userEmail}</div>
          <div>{userName}</div>
        </div>
      </CardHeader>

      {/* Invoice Details */}
      <CardContent className="p-6">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4 grid gap-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium">Invoice Number:</span>
            <span className="text-gray-700 dark:text-gray-300">
              {invoiceNumber}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Issue Date:</span>
            <span className="text-gray-700 dark:text-gray-300">
              {invoiceDate}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Due Date:</span>
            <span className="text-gray-700 dark:text-gray-300">{dueDate}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Payment Status:</span>
            <span className="flex items-center gap-2">
              {statusIcon} {paymentStatus}
            </span>
          </div>
        </div>

        {/* Bill To Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Bill To</h3>
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md shadow-sm text-sm">
            <p>{customerName}</p>
            <p>{customerCompanyName}</p>
            <p>{customerEmail}</p>
            <p>{customerAddress}</p>
          </div>
        </div>

        {/* Invoice Items Table */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Invoice Items</h3>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
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
                      {currencySymbol + item.total.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Totals Section */}
        <div className="mt-6 bg-gray-100 dark:bg-gray-700 p-4 rounded-md shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span>Subtotal</span>
            <span>{currencySymbol + subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span>Total Tax</span>
            <span>{currencySymbol + taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span>Discount</span>
            <span>{currencySymbol + discountAmount.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between mt-2 font-semibold text-lg">
            <span>Total Amount</span>
            <span>{currencySymbol + total.toFixed(2)}</span>
          </div>
        </div>

        {/* Notes Section */}
        {description && (
          <div className="mt-6 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm">
            <h3 className="text-lg font-semibold">Notes:</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {description}
            </p>
          </div>
        )}
      </CardContent>

      {/* Footer Section */}
      <CardFooter className="flex justify-end p-6 bg-gray-50 dark:bg-gray-900 rounded-b-xl">
        <Button
          className="no-print flex items-center gap-2"
          onClick={handlePrint}
        >
          <FiDownload /> Download
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InvoiceTemplateModel3;
