"use client";

import { CardWrapper } from "./card-wrapper";
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
import { ResetPasswordSchema } from "@/schemas";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form/form-error";
import { FormSuccess } from "../form/form-success";
import { resetPassword as resetPasswordAction } from "@/actions/reset-password";
import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";

export const ResetPasswordForm = () => {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | undefined>("");
  const [successMessage, setSuccesMessage] = useState<string | undefined>("");
  const router = useRouter();

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmitHandler = (values: z.infer<typeof ResetPasswordSchema>) => {
    // Reset the messages
    setErrorMessage("");
    setSuccesMessage("");

    startTransition(() => {
      resetPasswordAction(values).then((data) => {
        if (data?.error) {
          setErrorMessage(data.error);
        } else if (data?.resetUrl) {
          setSuccesMessage("Redirecting to reset page...");

          router.push(data.resetUrl);
        }
      });
    });
  };
  return (
    <CardWrapper
      headerLabel="Forgot your password?"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
      title=""
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmitHandler)}
          className="space-y-6"
        >
          <div className="space-y-4">
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
                      disabled={isPending}
                      placeholder="name@exemple.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            ></FormField>
          </div>
          <FormError message={errorMessage}></FormError>

          <FormSuccess message={successMessage}></FormSuccess>
          <Button disabled={isPending} type="submit" className="w-full">
            Send reset email
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
