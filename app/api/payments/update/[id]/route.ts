import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { PaymentSchema } from "@/schemas";
import { checkAuth } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const { authenticated, response, session } = await checkAuth();

  if (!authenticated) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 }
    );
  }

  try {
    const jsonData = await req.json();
    const result = PaymentSchema.safeParse(jsonData);

    if (!result.success) {
      console.error("Validation Errors:", result.error.errors);
      return NextResponse.json(
        { error: "Invalid payment data.", details: result.error.errors },
        { status: 400 }
      );
    }

    const { method, paymentDate, totalAmount, amountPaid } = result.data;

    const paymentDateObj = new Date(paymentDate);

    const existingPayment = await db.payment.findUnique({
      where: { id: String(id) },
      include: {
        invoice: {
          include: {
            customer: true,
          },
        },
      },
    });

    if (!existingPayment) {
      return NextResponse.json(
        { error: "Payment not found." },
        { status: 404 }
      );
    }

    const invoice = existingPayment.invoice;
    if (!invoice) {
      return NextResponse.json(
        { error: "Associated invoice not found." },
        { status: 404 }
      );
    }

    // Role-based access control
    if (session?.user.role === "USER") {
      // USERS : update payments for invoices they created
      if (invoice.userId !== session.user.id) {
        return NextResponse.json(
          { error: "You are not authorized to update this payment." },
          { status: 403 }
        );
      }
    } else if (session?.user.role === "CUSTOMER") {
      // CUSTOMERS : update payments for invoices associated with their email
      if (
        invoice.customer?.email !== session.user.email &&
        existingPayment.customerEmail !== session.user.email
      ) {
        return NextResponse.json(
          { error: "You are not authorized to update this payment." },
          { status: 403 }
        );
      }
    }

    // Fetch all previous payments for this invoice (excluding the current one being updated)
    const previousPayments = await db.payment.findMany({
      where: { invoiceId: invoice.id, NOT: { id: String(id) } },
    });

    // Calculate the total amount previously paid (excluding this payment)
    const totalPreviouslyPaid = previousPayments.reduce(
      (acc, payment) => acc + payment.amountPaid,
      0
    );

    // Calculate the total amount for this invoice and the amount left to pay
    const calculatedTotalAmount = totalAmount || invoice.total;
    const calculatedLeftToPay = calculatedTotalAmount - totalPreviouslyPaid;

    // Validate: Ensure the new amountPaid doesn't exceed the remaining balance
    if (amountPaid > calculatedLeftToPay) {
      return NextResponse.json(
        {
          error: `You cannot pay more than the remaining amount. The remaining amount is ${calculatedLeftToPay}.`,
        },
        { status: 400 }
      );
    }

    // Calculate the new total paid including the updated amount
    const newTotalPaid = totalPreviouslyPaid + amountPaid;
    const newLeftToPay = calculatedTotalAmount - newTotalPaid;

    let newStatus = existingPayment.status;
    if (newLeftToPay === 0) {
      newStatus = "PAID";
    } else if (newLeftToPay > 0 && newTotalPaid > 0) {
      newStatus = "PARTIALLY_PAID";
    } else {
      newStatus = "UNPAID";
    }

    const updatedPayment = await db.payment.update({
      where: { id: String(id) },
      data: {
        method,
        status: newStatus,
        paymentDate: paymentDateObj,
        totalAmount: calculatedTotalAmount,
        amountPaid,
        leftToPay: calculatedLeftToPay,
        // Ensure redundant customer fields are preserved
        customerName: invoice.customer?.name ?? existingPayment.customerName,
        customerEmail: invoice.customer?.email ?? existingPayment.customerEmail,
        customerCompanyName:
          invoice.customer?.companyName ?? existingPayment.customerCompanyName,
        customerPhone: invoice.customer?.phone ?? existingPayment.customerPhone,
        customerAddress:
          invoice.customer?.address ?? existingPayment.customerAddress,
      },
      include: {
        invoice: true,
      },
    });

    await db.invoice.update({
      where: { id: invoice.id },
      data: {
        paymentStatus: newStatus,
      },
    });

    return NextResponse.json({
      message: "Payment updated successfully, and invoice status updated.",
      updatedPayment,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while updating the payment" },
      { status: 500 }
    );
  }
}
