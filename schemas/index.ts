import { UserRole } from "@prisma/client";
import * as zod from "zod";

export const LoginSchema = zod.object({
  email: zod.string().email({ message: "Email is required" }),
  password: zod.string().min(1, { message: "Password is required" }),
});

export const RegisterSchema = zod.object({
  email: zod.string().email({ message: "Email is required" }),
  password: zod.string().min(6, { message: "Minimum 6 characters required" }),

  name: zod.string().min(3, { message: "Minimum 3 characters required" }),
  companyName: zod
    .string()
    .min(3, { message: "Minimum 3 characters required" }),
});

export const UserSchema = zod.object({
  email: zod.string().email({ message: "Email is required" }),
  password: zod.string().min(6, { message: "Minimum 6 characters required" }),

  name: zod.string().min(3, { message: "Minimum 3 characters required" }),
  companyName: zod
    .string()
    .min(3, { message: "Minimum 3 characters required" }),
  role: z.enum(["USER", "CUSTOMER", "ADMIN"], {
    required_error: "Role is required",
  }),
});

export const ResetPasswordSchema = zod.object({
  email: zod.string().email({ message: "Email is required" }),
});

export const NewPasswordSchema = zod.object({
  password: zod.string().min(6, { message: "Password is required" }),
});

export const SettingsSchema = zod
  .object({
    name: zod.optional(
      zod.string().min(3, { message: " Name must be at least 6 characters" })
    ),
    role: zod.enum([UserRole.ADMIN, UserRole.USER, UserRole.CUSTOMER]),
    email: zod.optional(
      zod.string().email({ message: "please provide a valid email" })
    ),
    password: zod.optional(
      zod.string().min(6, { message: "Password must be at least 6 characters" })
    ),
    newPassword: zod.optional(
      zod.string().min(6, { message: "Password must be at least 6 characters" })
    ),
    isTwoFactorEnabled: zod.optional(zod.boolean()),
    companyName: zod.string().min(3, { message: "Company name is required" }),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: "new password is required if you want to change your password",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message:
        "current password is required if you want to change your password",
      path: ["password"],
    }
  );

import { z } from "zod";

export const CustomerSchema = z.object({
  name: z.string().min(3, { message: "Minimum 3 characters required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z
    .string()
    .min(9, { message: "Phone number must be at least 10 characters long" })
    .max(15, { message: "Phone number can be at most 15 characters long" })
    .regex(/^\+?[1-9]\d{1,14}$/, { message: "Incorrect phone number format" }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters long" }),
  companyName: z.string().min(3, { message: "Minimum 3 characters required" }),
});

export const InvoiceItemSchema = z.object({
  itemName: z.string().min(1, "Item name is required"),
  quantity: z.preprocess(
    (val) => Number(val),
    z.number().min(1, "Quantity must be at least 1")
  ),
  unitPrice: z.preprocess(
    (val) => Number(val),
    z.number().min(1, "Unit price must be a positive value")
  ),
  tax: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Tax must be a positive value or zero")
  ),
  total: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Total must be a positive value or zero")
  ),
  totalTax: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Total tax must be a non-negative value")
  ),
});

export const InvoiceSchema = z.object({
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  invoiceDate: z
    .string()
    .refine(
      (date) => !isNaN(Date.parse(date)),
      "Invoice date must be a valid date"
    ),
  dueDate: z
    .string()
    .refine(
      (date) => !isNaN(Date.parse(date)),
      "Due date must be a valid date"
    ),
  customer: z.string().min(1, "Customer is required"),
  description: z.string().optional(),
  items: z.array(InvoiceItemSchema).nonempty("At least one item is required"),
  discount: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Discount must be a positive value or zero").optional()
  ),
  currency: z.enum(["USD", "EUR", "RON", "GBP", "AUD", "CAD", "CHF"], {
    errorMap: () => ({
      message: "Currency must be one of USD, EUR, RON, GBP, AUD, CAD, or CHF.",
    }),
  }),
  subtotal: z.number().min(1, "Subtotal is required and must be valid"),
  total: z.number().min(1, "Total is required and must be valid"),
  taxAmount: z.number().min(0, "Tax amount is required and must be valid"),
  discountAmount: z
    .number()
    .min(0, "Discount amount is required and must valid"),

  userName: z.string().min(1, "User name is required"),
  userCompanyName: z.string().min(1, "User company name is required"),
  userEmail: z
    .string()
    .email("User email must be a valid email address")
    .min(1, "User email is required"),

  paymentStatus: z.enum(["PAID", "UNPAID", "PENDING", "PARTIALLY_PAID"], {
    errorMap: () => ({
      message: "Incorect Payment status",
    }),
  }),
});

export const PaymentSchema = z.object({
  invoiceId: z.string().min(1, "Invoice ID is required"),
  totalAmount: z.number().optional(),
  method: z
    .string()
    .min(1, "Payment method is required")
    .refine(
      (val) => ["Credit Card", "Bank Transfer", "Cash", "PayPal"].includes(val),
      "Invalid payment method"
    ),
  status: z.enum(["PAID", "UNPAID", "PENDING", "PARTIALLY_PAID"]),
  paymentDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),

  amountPaid: z.coerce
    .number()
    .min(0, "Amount paid must be at least 0")
    .default(0),

  leftToPay: z.coerce.number().min(0).default(0),
  paymentNumber: z.string().min(1, "Payment number is required"),
});
