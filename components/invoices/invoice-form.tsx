"use client";

import { useForm, useFieldArray, useWatch } from "react-hook-form";
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
import { InvoiceSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { FaFileInvoice, FaPlus, FaMinus } from "react-icons/fa";
import { FormCardWrapper } from "../form/form-card-wrapper";
import { GrLinkNext } from "react-icons/gr";
import { IoArrowBackOutline } from "react-icons/io5";
import { Customer } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { Notification } from "../notification";
import { useSession } from "next-auth/react";
import useSWRInfinite from "swr/infinite";
import { formatDate } from "@/helpers/format-date";
import { mutate } from "swr";
import { FormErrors } from "../form/form-errors";
import { fetchApi } from "@/helpers/fetch-api";

// Define a fetcher function for SWR
//https://nextjs.org/docs/pages/building-your-application/data-fetching/client-side
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const InvoiceForm = ({
  onClose,
  onInvoiceCreated,
  invoice,
}: {
  onClose: () => void;
  onInvoiceCreated: (newInvoice: any) => void;
  invoice?: any;
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [openItem, setOpenItem] = useState<string | null>(null);
  const { data: session } = useSession();

  const { data, error, size, setSize, isValidating } = useSWRInfinite(
    (index) => `/api/customers/get?skip=${index * 10}&take=10`,
    fetcher
  );

  // Flatten the paginated customer data
  const customers = data
    ? [].concat(...data.map((page) => page.customers))
    : [];

  const totalCount = data?.[0]?.totalCount || 0;

  const hasMoreCustomers = customers.length < totalCount;

  const handleLoadMore = () => {
    if (hasMoreCustomers) {
      setSize(size + 1);
    }
  };

  if (error) {
    throw new Error("Failed to fetch data");
  }

  const form = useForm<z.infer<typeof InvoiceSchema>>({
    resolver: zodResolver(InvoiceSchema),
    mode: "onChange",
    defaultValues: invoice
      ? {
          ...invoice,
          invoiceDate: invoice.invoiceDate
            ? formatDate(invoice.invoiceDate)
            : "",
          dueDate: invoice.dueDate ? formatDate(invoice.dueDate) : "",
          customer: invoice.customer ? invoice.customer.id : "",
        }
      : {
          invoiceNumber: `No ${uuidv4().slice(0, 8)}`,
          invoiceDate: "",
          dueDate: "",
          customer: "",
          description: "",
          items: [],
          discount: 0,
          currency: "USD",
          subtotal: 0,
          total: 0,
          taxAmount: 0,
          discountAmount: 0,
          userName: session?.user?.name || "",
          userCompanyName: session?.user?.companyName || "",
          userEmail: session?.user?.email || "",
          paymentStatus: "UNPAID",
        },
  });

  const { control, handleSubmit, formState, setValue } = form;
  const { errors, isSubmitting } = formState;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = useWatch({ control, name: "items" });
  const discount = useWatch({ control, name: "discount" }) || 0;
  const selectedCurrency = useWatch({ control, name: "currency" });

  // Calculate subtotal by summing the price of all items
  const subtotal = items.reduce((acc, item) => {
    const quantity = parseFloat(item.quantity.toString());
    const unitPrice = parseFloat(item.unitPrice.toString());
    const itemTotal = quantity * unitPrice;
    return acc + itemTotal;
  }, 0);

  // Calculate total tax by summing the tax for each item
  const totalTax = items.reduce((acc, item) => {
    const quantity = parseFloat(item.quantity.toString());
    const unitPrice = parseFloat(item.unitPrice.toString());
    const taxRate = parseFloat(item.tax.toString()) / 100;
    const itemTotalTax = quantity * unitPrice * taxRate;
    return acc + itemTotalTax;
  }, 0);

  // Calculate discount amount based on the subtotal and discount percentage
  const discountPercentage = parseFloat(discount.toString()) / 100;
  const discountAmount = subtotal * discountPercentage;

  // Calculate total by applying discount and adding total tax
  const total = subtotal - discountAmount + totalTax;

  useEffect(() => {
    setValue("subtotal", +subtotal.toFixed(2));
    setValue("taxAmount", +totalTax.toFixed(2));
    setValue("discountAmount", +discountAmount.toFixed(2));
    setValue("total", +total.toFixed(2));
  }, [items, discount, setValue, subtotal, totalTax, discountAmount, total]);

  const currencySymbols: { [key: string]: string } = {
    USD: "$",
    EUR: "€",
    RON: "RON",
    GBP: "£",
    AUD: "A$",
    CAD: "C$",
    CHF: "CHF",
  };

  const currencySymbol = currencySymbols[selectedCurrency] || "$";

  const onSubmitHandler = async (values: z.infer<typeof InvoiceSchema>) => {
    // Recalculate totals for each item
    const updatedItems = values.items.map((item) => {
      const quantity = item.quantity || 0;
      const unitPrice = item.unitPrice || 0;
      const taxRate = (item.tax || 0) / 100;

      // Calculate total tax and total for each item
      const totalTax = quantity * unitPrice * taxRate;
      const total = quantity * unitPrice + totalTax;

      return {
        ...item,
        totalTax: totalTax,
        total: total,
      };
    });

    const updatedValues = {
      ...values,
      items: updatedItems,
      userName: session?.user?.name || "",
      userCompanyName: session?.user?.companyName || "",
      userEmail: session?.user?.email || "",
      paymentStatus: "UNPAID",
      currencySymbol: currencySymbol,
    };

    //fetchApi
    const endpoint = invoice
      ? `/api/invoices/update/${invoice.id}`
      : "/api/invoices/new";

    const result = await fetchApi(endpoint, {
      method: invoice ? "PUT" : "POST",
      body: updatedValues,
    });

    onInvoiceCreated(result.updatedInvoice || result.newInvoice);

    await mutate(`/api/invoices/get`, null, { revalidate: true });

    onClose();

    // Automatically create or update payment after invoice creation or update
    // const paymentValues = {
    //   invoiceId: result.newInvoice?.id || result.updatedInvoice?.id,
    //   method: "Credit Card",
    //   paymentDate: new Date(),
    //   status: "UNPAID",
    //   amountPaid: 0,
    //   totalAmount: result.newInvoice?.total || result.updatedInvoice?.total,
    //   leftToPay: result.newInvoice?.total || result.updatedInvoice?.total,
    //   paymentNumber: `No ${uuidv4().slice(0, 8)}`,
    //   customerAddress:
    //     result.newInvoice?.customer.address ||
    //     result.updatedInvoice?.customer.address,
    //   customerCompanyName:
    //     result.newInvoice?.customer.companyName ||
    //     result.updatedInvoice?.customer.companyName,
    //   customerEmail:
    //     result.newInvoice?.customer.email ||
    //     result.updatedInvoice?.customer.email,
    //   customerName:
    //     result.newInvoice?.customer.name ||
    //     result.updatedInvoice?.customer.name,
    //   customerPhone:
    //     result.newInvoice?.customer.phone ||
    //     result.updatedInvoice?.customer.phone,
    // };

    // let invoicePayments;
    // if (invoice?.id) {
    //   invoicePayments = await fetchApi(`/api/payments/invoice/${invoice.id}`);
    // }

    // const paymentEndpoint = invoice
    //   ? `/api/payments/update/${invoicePayments.payments[0].id}`
    //   : "/api/payments/new";

    // await fetchApi(paymentEndpoint, {
    //   method: invoice ? "PUT" : "POST",
    //   body: paymentValues,
    // });
  };

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handleBack = () => setCurrentStep((prev) => prev - 1);
  const handleAddItem = () => {
    const newItemIndex = fields.length;
    append({
      itemName: "",
      quantity: 1,
      unitPrice: 0,
      tax: 19,
      totalTax: 0,
      total: 0,
    });
    setOpenItem(`item-${newItemIndex}`);
  };
  const handleAddNextItem = (index: number) => {
    const newItemIndex = fields.length;
    append({
      itemName: "",
      quantity: 1,
      unitPrice: 0,
      tax: 19,
      totalTax: 0,
      total: 0,
    });
    setOpenItem(`item-${newItemIndex}`);
  };

  return (
    <FormCardWrapper
      title=""
      headerLabel={invoice ? "Edit Invoice" : "Create New Invoice"}
      onClose={onClose}
    >
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmitHandler)}
          className="space-y-6 px-4 py-4"
        >
          {currentStep === 0 && (
            <div className="space-y-4">
              {/* Invoice Number */}
              <FormField
                control={control}
                name="invoiceNumber"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Invoice Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Invoice number"
                        type="text"
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage>{errors.invoiceNumber?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* Invoice Date */}
              <FormField
                control={control}
                name="invoiceDate"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Invoice Date</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Invoice date"
                        type="date"
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage>{errors.invoiceDate?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* Due Date */}
              <FormField
                control={control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Due date"
                        type="date"
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage>{errors.dueDate?.message}</FormMessage>
                  </FormItem>
                )}
              />

              <div className="flex justify-between">
                <Button type="button" onClick={onClose} variant="outline">
                  Cancel
                </Button>
                <Button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleNext}
                >
                  <GrLinkNext />
                </Button>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              {/* Customer Select */}
              <FormField
                control={control}
                name="customer"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel htmlFor="customer">Customer</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        name="customer"
                      >
                        <SelectTrigger id="customer" className="w-full">
                          <SelectValue placeholder="Select a customer" />
                        </SelectTrigger>
                        <SelectContent className="max-h-40 overflow-y-auto">
                          <SelectGroup>
                            <SelectLabel>Customers</SelectLabel>
                            {customers.map((customer: Customer) => (
                              <SelectItem key={customer.id} value={customer.id}>
                                {customer.companyName}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                          {/* Load More Button */}
                          {hasMoreCustomers && (
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
                    <FormMessage>{errors.customer?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* Currency */}
              <FormField
                control={control}
                name="currency"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel htmlFor="currency">Currency</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        name="currency"
                      >
                        <SelectTrigger id="currency" className="w-full">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent className="max-h-40 overflow-y-auto">
                          <SelectGroup>
                            <SelectLabel>Currencies</SelectLabel>
                            <SelectItem value="USD">USD ($)</SelectItem>
                            <SelectItem value="EUR">EUR (€)</SelectItem>
                            <SelectItem value="RON">RON</SelectItem>
                            <SelectItem value="GBP">GBP (£)</SelectItem>
                            <SelectItem value="AUD">AUD (A$)</SelectItem>
                            <SelectItem value="CAD">CAD (C$)</SelectItem>
                            <SelectItem value="CHF">CHF</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage>{errors.currency?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={control}
                name="description"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Description"
                        type="text"
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage>{errors.description?.message}</FormMessage>
                  </FormItem>
                )}
              />

              <div className="flex justify-between">
                <Button type="button" onClick={handleBack} variant="outline">
                  <IoArrowBackOutline />
                </Button>
                <Button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleNext}
                >
                  <GrLinkNext />
                </Button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <Accordion
                type="single"
                collapsible
                value={openItem as string}
                onValueChange={(value) => setOpenItem(value)}
              >
                {fields.map((field, index) => {
                  const itemName =
                    items[index]?.itemName || `Item ${index + 1}`;

                  return (
                    <AccordionItem key={field.id} value={`item-${index}`}>
                      <AccordionTrigger>
                        {itemName || `Item ${index + 1}`}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 px-4">
                          {/* Item Name */}
                          <FormField
                            control={control}
                            name={`items.${index}.itemName`}
                            render={({ field }) => (
                              <FormItem className="space-y-2">
                                <FormLabel>Item Name</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Item name"
                                    type="text"
                                    className="w-full"
                                  />
                                </FormControl>
                                <FormMessage>
                                  {errors.items?.[index]?.itemName?.message}
                                </FormMessage>
                              </FormItem>
                            )}
                          />

                          {/* Quantity */}
                          <FormField
                            control={control}
                            name={`items.${index}.quantity`}
                            render={({ field }) => (
                              <FormItem className="space-y-2">
                                <FormLabel>Quantity</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Quantity"
                                    type="number"
                                    min="1"
                                    className="w-full"
                                  />
                                </FormControl>
                                <FormMessage>
                                  {errors.items?.[index]?.quantity?.message}
                                </FormMessage>
                              </FormItem>
                            )}
                          />

                          {/* Unit Price */}
                          <FormField
                            control={control}
                            name={`items.${index}.unitPrice`}
                            render={({ field }) => (
                              <FormItem className="space-y-2">
                                <FormLabel>Unit Price</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Unit price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    className="w-full"
                                  />
                                </FormControl>
                                <FormMessage>
                                  {errors.items?.[index]?.unitPrice?.message}
                                </FormMessage>
                              </FormItem>
                            )}
                          />

                          {/* Tax */}
                          <FormField
                            control={control}
                            name={`items.${index}.tax`}
                            render={({ field }) => (
                              <FormItem className="space-y-2">
                                <FormLabel>Tax (%)</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Tax percentage"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    className="w-full"
                                  />
                                </FormControl>
                                <FormMessage>
                                  {errors.items?.[index]?.tax?.message}
                                </FormMessage>
                              </FormItem>
                            )}
                          />

                          {/* Buttons to Add/Remove Items */}
                          <div className="flex justify-center space-x-4">
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => remove(index)}
                            >
                              <FaMinus />
                            </Button>

                            <Button
                              type="button"
                              size="sm"
                              onClick={() => handleAddNextItem(index)}
                            >
                              <FaPlus />
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>

              {fields.length === 0 && (
                <div className="flex justify-center items-center py-4">
                  <Button type="button" onClick={handleAddItem}>
                    <FaPlus /> Add Item
                  </Button>
                </div>
              )}

              <div className="flex justify-between">
                <Button type="button" onClick={handleBack} variant="outline">
                  <IoArrowBackOutline />
                </Button>
                <Button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleNext}
                >
                  <GrLinkNext />
                </Button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              {/* Discount */}
              <FormField
                control={control}
                name="discount"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Discount(%)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Discount"
                        type="number"
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage>{errors.discount?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* Totals */}
              <div className="space-y-2">
                <div>
                  <strong>Subtotal:</strong> {currencySymbol}
                  {subtotal.toFixed(2)}
                </div>
                <div>
                  <strong>Total Tax:</strong> {currencySymbol}
                  {totalTax.toFixed(2)}
                </div>
                <div>
                  <strong>Discount Amount:</strong> {currencySymbol}
                  {discountAmount.toFixed(2)}
                </div>
                <div>
                  <strong>Total:</strong> {currencySymbol}
                  {total.toFixed(2)}
                </div>
              </div>

              <FormErrors errors={errors} />

              <div className="flex justify-between">
                <Button type="button" onClick={handleBack} variant="outline">
                  <IoArrowBackOutline />
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  <FaFileInvoice />
                  {isSubmitting
                    ? invoice
                      ? "Updating..."
                      : "Creating..."
                    : invoice
                    ? "Update Invoice"
                    : "Create Invoice"}
                </Button>
              </div>
            </div>
          )}
        </form>
      </Form>
    </FormCardWrapper>
  );
};
