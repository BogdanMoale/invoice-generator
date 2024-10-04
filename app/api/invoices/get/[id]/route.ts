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
    const invoice = await db.invoice.findUnique({
      where: { id },
      include: {
        items: true,
        customer: true,
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Role-based access control
    if (session?.user.role === "USER") {
      // invoice belongs to the authenticated user
      if (invoice.userId !== session?.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
    } else if (session?.user.role === "CUSTOMER") {
      // invoice is associated with the customer (by email or redundant customerEmail)
      if (
        invoice.customer?.email !== session?.user.email &&
        invoice.customerEmail !== session?.user.email
      ) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
    }

    return NextResponse.json(invoice, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching invoice" },
      { status: 500 }
    );
  }
}
