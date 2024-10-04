import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { InvoiceSchema } from "@/schemas";

export async function POST(request: Request) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json(
      { error: "You must be logged in to create an invoice." },
      { status: 401 }
    );
  }

  if (session.user.role === "CUSTOMER") {
    return NextResponse.json(
      { error: "Customers are not allowed to create invoices." },
      { status: 403 }
    );
  }

  const invoiceData = await request.json();
  const { currencySymbol, ...validatedInvoiceData } = invoiceData;

  // Validate the data again on the backend
  const result = InvoiceSchema.safeParse(validatedInvoiceData);

  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid invoice data.", details: result.error.errors },
      { status: 400 }
    );
  }

  const {
    invoiceNumber,
    invoiceDate,
    dueDate,
    customer,
    description,
    items,
    discount,
    currency,
    subtotal,
    taxAmount,
    discountAmount,
    total,
    userName,
    userEmail,
    userCompanyName,
    paymentStatus,
  } = result.data;

  // Recalculate subtotal, tax amount, discount amount, and total
  const calculatedSubtotal = items.reduce((acc, item) => {
    const quantity = parseFloat(item.quantity.toString());
    const unitPrice = parseFloat(item.unitPrice.toString());
    const itemTotal = quantity * unitPrice;
    return acc + itemTotal;
  }, 0);

  const calculatedTotalTax = items.reduce((acc, item) => {
    const quantity = parseFloat(item.quantity.toString());
    const unitPrice = parseFloat(item.unitPrice.toString());
    const taxRate = parseFloat(item.tax.toString()) / 100;
    const itemTotalTax = quantity * unitPrice * taxRate;
    return acc + itemTotalTax;
  }, 0);

  const discountPercentage = parseFloat(discount?.toString() || "0") / 100;
  const calculatedDiscountAmount = calculatedSubtotal * discountPercentage;
  const calculatedTotal =
    calculatedSubtotal - calculatedDiscountAmount + calculatedTotalTax;

  try {
    // Check if the invoice number is unique
    const existingInvoice = await db.invoice.findUnique({
      where: { invoiceNumber },
    });

    if (existingInvoice) {
      return NextResponse.json(
        { error: "Invoice number already exists." },
        { status: 409 }
      );
    }

    // user is associated with the customer in the UserCustomer relation
    const userCustomerRelation = await db.userCustomer.findFirst({
      where: {
        userId: session.user.id,
        customerId: customer,
      },
    });

    if (!userCustomerRelation && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "You are not associated with this customer." },
        { status: 403 }
      );
    }

    const customerData = await db.customer.findUnique({
      where: { id: customer },
    });

    if (!customerData) {
      return NextResponse.json(
        { error: "Customer not found." },
        { status: 404 }
      );
    }

    const invoice = await db.invoice.create({
      data: {
        invoiceNumber,
        invoiceDate: new Date(invoiceDate),
        dueDate: new Date(dueDate),
        customerId: customerData.id,
        description,
        userId: session.user.id,
        items: {
          create: items.map(
            (item: {
              itemName: string;
              quantity: number;
              unitPrice: number;
              tax: number;
              totalTax: number;
              total: number;
            }) => ({
              itemName: item.itemName,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              tax: item.tax,
              totalTax: item.totalTax,
              total: item.total,
            })
          ),
        },
        discount,
        currency,
        subtotal: +calculatedSubtotal.toFixed(2),
        total: +calculatedTotal.toFixed(2),
        taxAmount: +calculatedTotalTax.toFixed(2),
        discountAmount: +calculatedDiscountAmount.toFixed(2),
        userName,
        userEmail,
        userCompanyName,
        paymentStatus,
        customerName: customerData.name,
        customerCompanyName: customerData.companyName,
        customerPhone: customerData.phone,
        customerEmail: customerData.email,
        customerAddress: customerData.address,
        currencySymbol,
      },
      include: {
        customer: true,
        items: true,
      },
    });

    return NextResponse.json(
      { message: "Invoice created successfully!", newInvoice: invoice },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json(
      {
        error:
          "An error occurred while creating the invoice. Please try again later.",
      },
      { status: 500 }
    );
  }
}
