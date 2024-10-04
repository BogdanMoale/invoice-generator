import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { InvoiceSchema } from "@/schemas";
import { checkAuth } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { authenticated, response, session } = await checkAuth();

  if (!authenticated) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 }
    );
  }

  const { id } = params;

  try {
    const invoiceData = await req.json();
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
    } = result.data;

    if (!customer) {
      return NextResponse.json(
        { error: "Customer ID is required to update an invoice." },
        { status: 400 }
      );
    }

    // Fetch the existing invoice to ensure it exists
    const existingInvoice = await db.invoice.findUnique({
      where: { id },
    });

    if (!existingInvoice) {
      return NextResponse.json(
        { error: "Invoice not found." },
        { status: 404 }
      );
    }

    // Role-based access control
    if (session?.user.role === "CUSTOMER") {
      return NextResponse.json(
        { error: "You do not have permission to update this invoice." },
        { status: 403 }
      );
    } else if (session?.user.role === "USER") {
      if (existingInvoice.userId !== session.user.id) {
        return NextResponse.json(
          { error: "You are not authorized to update this invoice." },
          { status: 403 }
        );
      }
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

    // Step 1: Update the invoice
    const updatedInvoice = await db.invoice.update({
      where: { id: String(id) },
      data: {
        invoiceNumber,
        invoiceDate: new Date(invoiceDate),
        dueDate: new Date(dueDate),
        customer: { connect: { id: customer } },
        description,
        items: {
          deleteMany: {}, // First, delete existing items to update them
          create: items.map((item: any) => ({
            itemName: item.itemName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            tax: item.tax,
            totalTax: item.totalTax,
            total: item.total,
          })),
        },
        // Use recalculated values
        discount,
        currency,
        subtotal: +calculatedSubtotal.toFixed(2),
        total: +calculatedTotal.toFixed(2),
        taxAmount: +calculatedTotalTax.toFixed(2),
        discountAmount: +calculatedDiscountAmount.toFixed(2),
        currencySymbol,
        // Use the fetched customer data to populate the redundant fields
        customerName: customerData.name,
        customerCompanyName: customerData.companyName,
        customerPhone: customerData.phone,
        customerEmail: customerData.email,
        customerAddress: customerData.address,
      },
      include: {
        customer: true,
      },
    });

    // Update all related payments
    const payments = await db.payment.findMany({
      where: { invoiceId: id },
    });

    for (const payment of payments) {
      const leftToPay = updatedInvoice.total - payment.amountPaid;
      const newStatus =
        leftToPay === 0
          ? "PAID"
          : leftToPay > 0 && payment.amountPaid > 0
          ? "PARTIALLY_PAID"
          : "UNPAID";

      await db.payment.update({
        where: { id: payment.id },
        data: {
          totalAmount: updatedInvoice.total,
          leftToPay: leftToPay > 0 ? leftToPay : 0,
          status: newStatus,
        },
      });
    }

    return NextResponse.json({
      message: "Invoice and payments updated successfully",
      updatedInvoice,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while updating the invoice" },
      { status: 500 }
    );
  }
}
