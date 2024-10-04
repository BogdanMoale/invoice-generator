import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAuth } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { invoiceId: string } }
) {
  const { authenticated, response, session } = await checkAuth();

  if (!authenticated) {
    return response;
  }

  const { invoiceId } = params;

  try {
    const invoice = await db.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        customer: true,
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Role-based access control
    if (session?.user.role === "USER") {
      // USERS: view payments for invoices they created
      if (invoice.userId !== session?.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
    } else if (session?.user.role === "CUSTOMER") {
      // CUSTOMERS: view payments for invoices associated with their email
      if (
        invoice.customer?.email !== session?.user.email &&
        !invoice.customerEmail // Check redundant customerEmail if customer relation is null
      ) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
    }

    const payments = await db.payment.findMany({
      where: { invoiceId },
    });

    // Calculate total paid and remaining amount to be paid
    const totalPaid = payments.reduce(
      (acc, payment) => acc + payment.amountPaid,
      0
    );
    const leftToPay = invoice.total - totalPaid;

    return NextResponse.json(
      {
        payments,
        totalPaid,
        leftToPay: leftToPay > 0 ? leftToPay : 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching payments for invoice:", error);
    return NextResponse.json(
      { error: "Error fetching payments for invoice" },
      { status: 500 }
    );
  }
}
