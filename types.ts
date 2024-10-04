import { UserRole, PaymentStatus } from "@prisma/client";

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  emailVerified?: Date | null;
  image?: string | null;
  password?: string | null;
  role: UserRole;
  companyName?: string | null;
  accounts: Account[];
  customers: Customer[];
  invoices: Invoice[];
}

export interface Account {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string | null;
  access_token?: string | null;
  expires_at?: number | null;
  token_type?: string | null;
  scope?: string | null;
  id_token?: string | null;
  session_state?: string | null;
  user: User;
}

export interface VerificationToken {
  id: string;
  token: string;
  email: string;
  expiresAt: Date;
}

export interface PasswordResetToken {
  id: string;
  token: string;
  email: string;
  expiresAt: Date;
}

export interface UserCustomer {
  userId: string;
  customerId: string;
  user: User;
}

export interface Customer {
  id: string;
  name: string;
  companyName?: string | null;
  email: string;
  phone?: string | null;
  address?: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  users: UserCustomer[];
  invoices: Invoice[];
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  customerId?: string | null;
  userId: string;
  description?: string | null;
  items: InvoiceItem[];
  currency: string;
  tax: number;
  discount: number;
  subtotal: number;
  total: number;
  taxAmount: number;
  discountAmount: number;
  currencySymbol: string;
  paymentStatus: PaymentStatus;
  userName?: string | null;
  userCompanyName?: string | null;
  userEmail?: string | null;
  createdAt: Date;
  updatedAt: Date;
  customer?: Customer | null;
  user: User;
  // Redundant customer info fields
  customerName?: string | null;
  customerCompanyName?: string | null;
  customerPhone?: string | null;
  customerEmail?: string | null;
  customerAddress?: string | null;
  payments: Payment[];
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  totalTax: number;
  total: number;
  invoice: Invoice;
}

export interface Payment {
  id: string;
  paymentNumber: string;
  invoiceId: string;
  totalAmount: number;
  amountPaid: number;
  leftToPay: number;
  method: string;
  status: PaymentStatus;
  paymentDate: Date;
  createdAt: Date;
  updatedAt: Date;
  invoice: Invoice;
  // Redundant customer info fields
  customerName?: string | null;
  customerCompanyName?: string | null;
  customerPhone?: string | null;
  customerEmail?: string | null;
  customerAddress?: string | null;
}

export interface InvoiceTemplateModelProps {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  userName: string;
  userCompanyName: string;
  userEmail: string;
  customerName: string;
  customerCompanyName: string;
  customerEmail: string;
  customerAddress: string;
  items: Array<{
    id: string;
    invoiceId: string;
    itemName: string;
    quantity: number;
    unitPrice: number;
    tax: number;
    totalTax: number;
    total: number;
  }>;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  paymentStatus: string;
  description?: string;
  currencySymbol: string;
}
