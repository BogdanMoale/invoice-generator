"use client";

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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormCardWrapper } from "../form/form-card-wrapper";
import { User } from "@/types";
import { Notification } from "../notification";
import { UserSchema } from "@/schemas";
import * as z from "zod";
import { FormErrors } from "../form/form-errors";
import { fetchApi } from "@/helpers/fetch-api";

export const UserForm = ({
  onClose,
  onUserCreated,
  user,
}: {
  onClose: () => void;
  onUserCreated: (newUser: User) => void;
  user?: User;
}) => {
  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    mode: "onChange",
    defaultValues: user
      ? {
          ...user,
          email: user.email || "",
          password: user.password || "",
          name: user.name || "",
          companyName: user.companyName || "",
          role: user.role || "USER",
        }
      : {
          email: "",
          password: "",
          name: "",
          companyName: "",
          role: "USER",
        },
  });

  const { control, handleSubmit, formState } = form;
  const { errors, isSubmitting } = formState;

  const onSubmitHandler = async (values: z.infer<typeof UserSchema>) => {
    const endpoint = user ? `/api/users/update/${user.id}` : "/api/users/new";

    const result = await fetchApi(endpoint, {
      method: user ? "PUT" : "POST",
      body: values,
    });

    onUserCreated(result.newUser || result.updatedUser);
    onClose();
  };

  return (
    <FormCardWrapper
      title=""
      headerLabel={user ? "Edit User" : "Create New User"}
      onClose={onClose}
    >
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmitHandler)}
          className="space-y-6 px-4 py-4"
        >
          {/* Name Input */}
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Name"
                    disabled={isSubmitting}
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage>{errors.name?.message}</FormMessage>
              </FormItem>
            )}
          />

          {/* Company Name Input */}
          <FormField
            control={control}
            name="companyName"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Company Name"
                    disabled={isSubmitting}
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage>{errors.companyName?.message}</FormMessage>
              </FormItem>
            )}
          />

          {/* Email Input */}
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="name@example.com"
                    type="email"
                    disabled={isSubmitting}
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage>{errors.email?.message}</FormMessage>
              </FormItem>
            )}
          />

          {/* Password Input */}
          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="*********"
                    type="password"
                    disabled={isSubmitting}
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage>{errors.password?.message}</FormMessage>
              </FormItem>
            )}
          />

          {/* Role */}
          <FormField
            control={control}
            name="role"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel htmlFor="role-select">Role</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    name={field.name}
                  >
                    <SelectTrigger id="role-select">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USER">User</SelectItem>
                      <SelectItem value="CUSTOMER">Customer</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage>{errors.role?.message}</FormMessage>
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
                ? user
                  ? "Updating..."
                  : "Creating..."
                : user
                ? "Update User"
                : "Create User"}
            </Button>
          </div>
        </form>
      </Form>
    </FormCardWrapper>
  );
};
