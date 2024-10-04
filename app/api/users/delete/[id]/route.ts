import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAuth } from "@/lib/auth";

interface Params {
  id: string;
}

export async function DELETE(req: Request, { params }: { params: Params }) {
  const { authenticated, session } = await checkAuth();

  if (!authenticated || session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const existingUser = await db.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete the many-to-many relationships
    await db.userCustomer.deleteMany({
      where: {
        userId: id,
      },
    });

    // Delete invoices associated with the user
    await db.invoice.deleteMany({
      where: { userId: id },
    });

    // Delete payments associated with the user's invoices
    await db.payment.deleteMany({
      where: {
        invoice: {
          userId: id,
        },
      },
    });

    const account = await db.account.findFirst({
      where: { userId: id },
    });

    if (account) {
      await db.account.delete({
        where: {
          id: account.id,
        },
      });
    }

    await db.user.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "User and related records deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Error deleting user" }, { status: 500 });
  }
}
