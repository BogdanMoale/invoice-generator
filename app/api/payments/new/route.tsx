import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { PaymentSchema } from "@/schemas";
import { checkAuth } from "@/lib/auth";

export async function POST(request: Request) {
  const { authenticated, response, session } = await checkAuth();

  if (!authenticated) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 }
    );
  }

  const paymentData = await request.json();
  const result = PaymentSchema.safeParse(paymentData);

  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid payment data.", details: result.error.errors },
      { status: 400 }
    );
  }

  let {
    invoiceId,
    method,
    status,
    paymentDate,
    totalAmount,
    amountPaid,
    paymentNumber,
  } = result.data;

  try {
    let invoice = await db.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        customer: true,
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: "Invoice not found." },
        { status: 404 }
      );
    }

    // Role-based access control
    if (session?.user.role === "USER") {
      // USER: create payments for invoices they created
      if (invoice.userId !== session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
    } else if (session?.user.role === "CUSTOMER") {
      // CUSTOMER: create payments for invoices associated with their email
      if (
        invoice.customer?.email !== session.user.email &&
        invoice.customerEmail !== session.user.email
      ) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
    }

    // Check if there is already an UNPAID payment for this invoice
    let existingUnpaidPayment = await db.payment.findFirst({
      where: { invoiceId, status: "UNPAID" },
    });

    const previousPayments = await db.payment.findMany({
      where: { invoiceId },
    });

    // Calculate the total amount already paid
    const totalPreviouslyPaid = previousPayments.reduce(
      (acc, payment) => acc + payment.amountPaid,
      0
    );

    // Calculate the total amount for this payment and the amount left to pay
    const calculatedTotalAmount = totalAmount || invoice.total;
    const calculatedLeftToPay = calculatedTotalAmount - totalPreviouslyPaid;

    // Validate: Cannot pay more than the remaining amount
    if (amountPaid > calculatedLeftToPay) {
      return NextResponse.json(
        {
          error: `You cannot pay more than the remaining amount. The remaining amount is ${calculatedLeftToPay}.`,
        },
        { status: 400 }
      );
    }

    // Calculate new total paid after this payment
    const newTotalPaid = totalPreviouslyPaid + amountPaid;
    const newLeftToPay = calculatedTotalAmount - newTotalPaid;

    if (newLeftToPay === 0) {
      status = "PAID";
    } else if (newLeftToPay > 0 && newTotalPaid > 0) {
      status = "PARTIALLY_PAID";
    } else {
      status = "UNPAID";
    }

    // If an UNPAID payment exists, update it
    let payment;
    if (existingUnpaidPayment) {
      payment = await db.payment.update({
        where: { id: existingUnpaidPayment.id },
        data: {
          method,
          status,
          paymentDate: new Date(paymentDate),
          amountPaid,
          totalAmount: calculatedTotalAmount,
          leftToPay: calculatedLeftToPay,
          paymentNumber,
          // Store redundant customer fields from the invoice
          customerName: invoice.customer?.name ?? invoice.customerName,
          customerEmail: invoice.customer?.email ?? invoice.customerEmail,
          customerCompanyName:
            invoice.customer?.companyName ?? invoice.customerCompanyName,
          customerPhone: invoice.customer?.phone ?? invoice.customerPhone,
          customerAddress: invoice.customer?.address ?? invoice.customerAddress,
        },
        include: {
          invoice: true,
        },
      });
    } else {
      // If no UNPAID payment exists, create a new payment
      payment = await db.payment.create({
        data: {
          invoiceId,
          method,
          status,
          paymentDate: new Date(paymentDate),
          amountPaid,
          totalAmount: calculatedTotalAmount,
          leftToPay: calculatedLeftToPay,
          paymentNumber,
          // Store redundant customer fields from the invoice
          customerName: invoice.customer?.name ?? invoice.customerName,
          customerEmail: invoice.customer?.email ?? invoice.customerEmail,
          customerCompanyName:
            invoice.customer?.companyName ?? invoice.customerCompanyName,
          customerPhone: invoice.customer?.phone ?? invoice.customerPhone,
          customerAddress: invoice.customer?.address ?? invoice.customerAddress,
        },
        include: {
          invoice: true,
        },
      });
    }

    // Update the invoice payment status
    await db.invoice.update({
      where: { id: invoiceId },
      data: {
        paymentStatus: status,
      },
    });

    return NextResponse.json(
      {
        message: existingUnpaidPayment
          ? "Payment updated successfully!"
          : "Payment created successfully!",
        newPayment: payment,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "An error occurred while recording the payment. Please try again later.",
      },
      { status: 500 }
    );
  }
}
