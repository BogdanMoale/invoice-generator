"use client";

import { FormCardWrapper } from "@/components/form/form-card-wrapper";
import { useForm } from "react-hook-form";
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
import { CustomerSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Customer } from "@/types";
import { GrDocumentUpdate } from "react-icons/gr";
import { fetchApi } from "@/helpers/fetch-api";
import { FormErrors } from "../form/form-errors";

export const UpdateCustomerForm = ({
  onClose,
  onCustomerUpdated,
  initialData,
}: {
  onClose: () => void;
  onCustomerUpdated: (customer: Customer) => void;
  initialData: Customer;
}) => {
  const [isPosting, setIsPosting] = useState(false);

  const form = useForm<z.infer<typeof CustomerSchema>>({
    resolver: zodResolver(CustomerSchema),
    defaultValues: {
      ...initialData,
      phone: initialData.phone ?? "",
      address: initialData.address ?? "",
      companyName: initialData.companyName ?? "",
    },
  });

  const onSubmitHandler = async (values: z.infer<typeof CustomerSchema>) => {
    setIsPosting(true);

    const result = await fetchApi(`/api/customers/update/${initialData.id}`, {
      method: "PUT",
      body: values,
    });

    onCustomerUpdated({ ...initialData, ...values });
    onClose();
    setIsPosting(false);
  };

  return (
    <FormCardWrapper title="" headerLabel="Update Customer" onClose={onClose}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmitHandler)}
          className="space-y-6"
        >
          <div className="space-y-4">
            {/* Name input */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={form.formState.isSubmitting}
                      placeholder="Customer name"
                      type="text"
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            />

            {/* Company Name input */}
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={form.formState.isSubmitting}
                      placeholder="Company name"
                      type="text"
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            />

            {/* Email input */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={form.formState.isSubmitting}
                      placeholder="name@example.com"
                      type="email"
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            />

            {/* Phone input */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={form.formState.isSubmitting}
                      placeholder="+4012345789"
                      type="tel"
                      pattern="[+]?[0-9]{10,15}"
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            />

            {/* Address input */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={form.formState.isSubmitting}
                      placeholder="Customer address"
                      type="text"
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            />
          </div>

          <FormErrors errors={form.formState.errors}></FormErrors>

          <div className="flex justify-center mt-6">
            {!isPosting ? (
              <Button disabled={form.formState.isSubmitting} type="submit">
                Update
                <GrDocumentUpdate />
              </Button>
            ) : (
              <Button disabled={form.formState.isSubmitting} type="submit">
                Updating Customer...
              </Button>
            )}
          </div>
        </form>
      </Form>
    </FormCardWrapper>
  );
};
