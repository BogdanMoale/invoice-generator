import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAuth } from "@/lib/auth";

interface Params {
  id: string;
}

export async function DELETE(req: Request, { params }: { params: Params }) {
  const { authenticated, response, session } = await checkAuth();

  if (!authenticated) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 }
    );
  }

  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: "Payment ID is required" },
      { status: 400 }
    );
  }

  try {
    const payment = await db.payment.findUnique({
      where: { id },
      include: { invoice: true },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Role-based access control
    if (session?.user.role === "CUSTOMER") {
      return NextResponse.json(
        { error: "You do not have permission to delete this payment." },
        { status: 403 }
      );
    }

    if (session?.user.role === "USER") {
      if (payment.invoice.userId !== session.user.id) {
        return NextResponse.json(
          { error: "You are not authorized to delete this payment." },
          { status: 403 }
        );
      }
    }

    await db.payment.delete({
      where: { id },
    });

    // remaining payments for the invoice
    const remainingPayments = await db.payment.count({
      where: { invoiceId: payment.invoiceId },
    });

    if (remainingPayments === 0) {
      // update the invoice status to UNPAID
      await db.invoice.update({
        where: { id: payment.invoiceId },
        data: { paymentStatus: "UNPAID" },
      });
    }

    return NextResponse.json(
      { message: "Payment deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting payment" },
      { status: 500 }
    );
  }
}
