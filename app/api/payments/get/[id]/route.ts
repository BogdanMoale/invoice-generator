import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAuth } from "@/lib/auth";

export async function GET(
  request: Request,
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
    const payment = await db.payment.findUnique({
      where: { id },
      include: {
        invoice: {
          include: {
            customer: true, // customer details to validate access for customers
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Payment record not found" },
        { status: 404 }
      );
    }

    // Role-based access control
    if (session?.user.role === "USER") {
      // USER : access payments related to invoices they created
      if (payment.invoice.userId !== session?.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
    } else if (session?.user.role === "CUSTOMER") {
      // CUSTOMER: access payments related to invoices associated with their email
      // Check if the customer is directly associated via the relation or redundant fields
      if (
        payment.invoice.customer?.email !== session?.user.email &&
        payment.customerEmail !== session?.user.email
      ) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
    }

    return NextResponse.json(payment, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching payment" },
      { status: 500 }
    );
  }
}
