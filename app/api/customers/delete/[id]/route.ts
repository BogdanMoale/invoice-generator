import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAuth } from "@/lib/auth";

export async function DELETE(
  request: Request,
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
    if (!id) {
      return NextResponse.json(
        { message: "Customer ID is required" },
        { status: 400 }
      );
    }

    const customer = await db.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      return NextResponse.json(
        { message: "Customer not found" },
        { status: 404 }
      );
    }

    // Role-based logic
    if (session?.user.role === "CUSTOMER") {
      return NextResponse.json(
        { message: "You do not have permission to delete this customer." },
        { status: 403 }
      );
    } else if (session?.user.role === "USER") {
      // Ensure the user is associated with the customer before deleting
      const userCustomerRelation = await db.userCustomer.findFirst({
        where: {
          userId: session.user.id,
          customerId: id,
        },
      });

      if (!userCustomerRelation) {
        return NextResponse.json(
          { message: "You are not authorized to delete this customer." },
          { status: 403 }
        );
      }
    }

    // customerId to null for invoices related to this customer, but keep redundant data
    await db.invoice.updateMany({
      where: { customerId: id },
      data: {
        customerId: null,
        customerEmail: customer.email,
        customerName: customer.name,
        customerCompanyName: customer.companyName,
        customerPhone: customer.phone,
        customerAddress: customer.address,
      },
    });

    // set customerId to null in payments (if applicable)
    await db.payment.updateMany({
      where: { customerEmail: customer.email },
      data: {
        customerEmail: customer.email,
      },
    });

    const deletedCustomer = await db.customer.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Customer deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
