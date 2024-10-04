"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { PaymentSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormCardWrapper } from "../form/form-card-wrapper";
import { Notification } from "../notification";
import { Payment } from "@/types";
import { v4 as uuidv4 } from "uuid";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { FormErrors } from "../form/form-errors";
import { fetchApi } from "@/helpers/fetch-api";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const PaymentForm = ({
  onClose,
  onPaymentCreated,
  payment,
}: {
  onClose: () => void;
  onPaymentCreated: (newPayment: Payment) => void;
  payment?: Payment;
}) => {
  //fetch invoices
  const { data, error, size, setSize, isValidating } = useSWRInfinite(
    (index) => `/api/invoices/get?skip=${index * 10}&take=10`,
    fetcher
  );

  const invoices = data ? [].concat(...data.map((page) => page.invoices)) : [];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const filteredInvoices: any[] =
    invoices.filter(
      (invoice: any) =>
        invoice.paymentStatus === "UNPAID" ||
        invoice.paymentStatus === "PARTIALLY_PAID"
    ) || [];

  const totalCount = data?.[0]?.totalCount || 0;

  const hasMoreInvoices = invoices.length < totalCount;

  const handleLoadMore = () => {
    if (hasMoreInvoices) {
      setSize(size + 1);
    }
  };

  if (error) {
    throw new Error("Error fetching invoices");
  }

  const form = useForm<z.infer<typeof PaymentSchema>>({
    resolver: zodResolver(PaymentSchema),
    mode: "onChange",
    defaultValues: payment
      ? {
          ...payment,
          paymentNumber: payment.paymentNumber || `No ${uuidv4().slice(0, 8)}`,
          paymentDate: payment.paymentDate
            ? new Date(payment.paymentDate).toISOString().split("T")[0]
            : "",
        }
      : {
          invoiceId: "",
          method: "",
          status: "PENDING",
          paymentDate: "",
          amountPaid: 0,
          paymentNumber: `No ${uuidv4().slice(0, 8)}`,
        },
  });

  const { control, handleSubmit, formState } = form;
  const { errors, isSubmitting } = formState;

  // const selectedInvoiceId = watch("invoiceId");
  // const amountPaid = watch("amountPaid") || 0;

  const selectedInvoiceId = useWatch({ control, name: "invoiceId" });
  const amountPaid = useWatch({ control, name: "amountPaid" }) || 0;

  // Fetch payment data for the selected invoice
  const { data: paymentData, error: paymentError } = useSWR(
    selectedInvoiceId ? `/api/payments/invoice/${selectedInvoiceId}` : null,
    fetcher
  );

  if (paymentError) {
    throw new Error("Error fetching payments");
  }

  const selectedInvoice = filteredInvoices.find(
    (invoice: any) => invoice.id === selectedInvoiceId
  );
  const selectedInvoiceTotal = selectedInvoice?.total || 0;
  const selectedCurrencySymbol = selectedInvoice?.currencySymbol || "$";
  const totalPaid = payment
    ? paymentData?.totalPaid - payment.amountPaid
    : paymentData?.totalPaid || 0;

  // Calculate total left to pay by subtracting the amount paid so far and the current amount paid
  const totalLeftToPay = selectedInvoiceTotal - totalPaid - amountPaid;

  const onSubmitHandler = async (values: z.infer<typeof PaymentSchema>) => {
    const updatedValues = {
      ...values,
      totalAmount: selectedInvoiceTotal,
    };

    const endpoint = payment
      ? `/api/payments/update/${payment.id}`
      : "/api/payments/new";

    const result = await fetchApi(endpoint, {
      method: payment ? "PUT" : "POST",
      body: updatedValues,
    });

    onPaymentCreated(result.newPayment || result.updatedPayment);

    onClose();
  };

  return (
    <FormCardWrapper
      title=""
      headerLabel={payment ? "Edit Payment" : "Create New Payment"}
      onClose={onClose}
    >
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmitHandler)}
          className="space-y-6 px-4 py-4"
        >
          {/* Invoice Select */}
          <FormField
            control={control}
            name="invoiceId"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel htmlFor="invoiceId">Select Invoice</FormLabel>
                <FormControl>
                  <Select
                    name="invoiceId"
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger id="invoiceId" className="w-full">
                      <SelectValue placeholder="Select an invoice" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      <SelectGroup>
                        {filteredInvoices.map((invoice: any) => (
                          <SelectItem key={invoice.id} value={invoice.id}>
                            {invoice.invoiceNumber}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                      {hasMoreInvoices && (
                        <div className="flex justify-center p-2">
                          <Button
                            size="sm"
                            type="button"
                            onClick={handleLoadMore}
                          >
                            Load More
                          </Button>
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage>{errors.invoiceId?.message}</FormMessage>
              </FormItem>
            )}
          />

          {/* Total Amount and Total Left to Pay */}
          <div className="flex gap-x-8">
            {/* Total Amount (Label) */}
            <div className="space-y-2">
              <div className="text-sm font-medium">Total Amount</div>
              <div className="text-lg font-medium">
                {!paymentData || !invoices ? (
                  <div className="w-6 h-6 border-4 border-t-4 border-t-green-600 rounded-full animate-spin"></div>
                ) : (
                  `${selectedCurrencySymbol}${selectedInvoiceTotal.toFixed(2)}`
                )}
              </div>
            </div>

            {/* Total Left to Pay (Label) */}
            <div className="space-y-2">
              <div className="text-sm font-medium">Left to Pay</div>
              <div className="text-lg font-medium">
                {!paymentData || !invoices ? (
                  <div className="w-6 h-6 border-4 border-t-4 border-t-green-600 rounded-full animate-spin"></div>
                ) : (
                  `${selectedCurrencySymbol}${totalLeftToPay.toFixed(2)}`
                )}
              </div>
            </div>
          </div>

          {/* Amount Paid */}
          <FormField
            control={control}
            name="amountPaid"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Amount Paid</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Amount"
                    type="number"
                    step="0.01"
                    className="w-full"
                  />
                </FormControl>
                <FormMessage>{errors.amountPaid?.message}</FormMessage>
              </FormItem>
            )}
          />

          {/* Method */}
          <FormField
            control={control}
            name="method"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel htmlFor="paymentMethod">Payment Method</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    name="paymentMethod"
                  >
                    <SelectTrigger id="paymentMethod" className="w-full">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Credit Card">Credit Card</SelectItem>
                        <SelectItem value="Bank Transfer">
                          Bank Transfer
                        </SelectItem>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="PayPal">PayPal</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage>{errors.method?.message}</FormMessage>
              </FormItem>
            )}
          />

          {/* Payment Date */}
          <FormField
            control={control}
            name="paymentDate"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Payment Date</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Payment date"
                    type="date"
                    className="w-full"
                  />
                </FormControl>
                <FormMessage>{errors.paymentDate?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormErrors errors={errors}></FormErrors>

          {/* Submit Button */}
          <div className="flex justify-between">
            <Button type="button" onClick={onClose} variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? payment
                  ? "Updating..."
                  : "Creating..."
                : payment
                ? "Update Payment"
                : "Pay"}
            </Button>
          </div>
        </form>
      </Form>
    </FormCardWrapper>
  );
};
