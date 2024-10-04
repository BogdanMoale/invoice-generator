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
import { IoMdAdd } from "react-icons/io";
import { Notification } from "@/components/notification";
import { FormErrors } from "../form/form-errors";
import { fetchApi } from "@/helpers/fetch-api";

export const CustomersForm = ({
  onClose,
  onCustomerAdded,
}: {
  onClose: () => void;
  onCustomerAdded: (customer: Customer) => void;
}) => {
  const [isPosting, setIsPosting] = useState(false);

  const form = useForm<z.infer<typeof CustomerSchema>>({
    resolver: zodResolver(CustomerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      companyName: "",
    },
  });

  const onSubmitHandler = async (values: z.infer<typeof CustomerSchema>) => {
    setIsPosting(true);

    const result = await fetchApi("/api/customers/add", {
      method: "POST",
      body: values,
    });

    onCustomerAdded(result.customer);
    onClose();
    setIsPosting(false);
  };

  return (
    <FormCardWrapper
      title=""
      headerLabel="Create new customer"
      onClose={onClose}
    >
      {/* "X" Button */}
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
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="name"
                      name="name"
                      disabled={form.formState.isSubmitting}
                      placeholder="Customer name"
                      type="text"
                      autoComplete="name"
                    />
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            ></FormField>

            {/* Company Name input */}
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="companyName">Company Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="companyName"
                      name="companyName"
                      disabled={form.formState.isSubmitting}
                      placeholder="Company name"
                      type="text"
                      autoComplete="organization"
                    />
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            ></FormField>

            {/* Email input */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="email"
                      name="email"
                      disabled={form.formState.isSubmitting}
                      placeholder="name@example.com"
                      type="email"
                      autoComplete="email"
                    />
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            ></FormField>

            {/* Phone input */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="phone">Phone</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="phone"
                      name="phone"
                      disabled={form.formState.isSubmitting}
                      placeholder="+4012345789"
                      type="tel"
                      pattern="[+]?[0-9]{10,15}"
                      autoComplete="tel"
                    />
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            ></FormField>

            {/* Address input */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="address">Address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="address"
                      name="address"
                      disabled={form.formState.isSubmitting}
                      placeholder="Customer address"
                      type="text"
                      autoComplete="street-address"
                    />
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            ></FormField>
          </div>

          <FormErrors errors={form.formState.errors}></FormErrors>

          <div className="flex justify-center mt-6">
            {!isPosting ? (
              <Button disabled={form.formState.isSubmitting} type="submit">
                Add
                <IoMdAdd></IoMdAdd>
              </Button>
            ) : (
              <Button disabled={form.formState.isSubmitting} type="submit">
                Adding Customer...
              </Button>
            )}
          </div>
        </form>
      </Form>
    </FormCardWrapper>
  );
};
