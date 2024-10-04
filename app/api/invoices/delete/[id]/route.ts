import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAuth } from "@/lib/auth";

interface Params {
  id: string;
}

export async function DELETE(req: Request, { params }: { params: Params }) {
  const { authenticated, response, session } = await checkAuth();

  if (!authenticated) {
    return response;
  }

  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: "Invoice ID is required" },
      { status: 400 }
    );
  }

  try {
    // Fetch the invoice to check if it exists and to retrieve its userId
    const invoice = await db.invoice.findUnique({
      where: { id },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Role-based access control
    if (session?.user.role === "CUSTOMER") {
      return NextResponse.json(
        { error: "You do not have permission to delete this invoice." },
        { status: 403 }
      );
    }

    if (session?.user.role === "USER") {
      if (invoice.userId !== session.user.id) {
        return NextResponse.json(
          { error: "You are not authorized to delete this invoice." },
          { status: 403 }
        );
      }
    }

    // Delete related invoice items first
    await db.invoiceItem.deleteMany({
      where: { invoiceId: id },
    });

    await db.invoice.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Invoice deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting invoice" },
      { status: 500 }
    );
  }
}
