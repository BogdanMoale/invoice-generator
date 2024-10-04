import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { CustomerSchema } from "@/schemas";
import { checkAuth } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { authenticated, response, session } = await checkAuth();

    if (!authenticated) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { error: "Customer ID is required" },
        { status: 400 }
      );
    }

    const customerData = await request.json();
    const result = CustomerSchema.safeParse(customerData);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid customer data.", details: result.error.errors },
        { status: 400 }
      );
    }

    const { name, email, phone, address, companyName } = result.data;

    // Role-based logic
    if (session?.user.role === "CUSTOMER") {
      // Customers are not allowed to update other customers
      return NextResponse.json(
        { error: "You do not have permission to update this customer." },
        { status: 403 }
      );
    } else if (session?.user.role === "USER") {
      // user is associated with the customer via UserCustomer relation
      const userCustomerRelation = await db.userCustomer.findFirst({
        where: {
          userId: session.user.id,
          customerId: id,
        },
      });

      if (!userCustomerRelation) {
        return NextResponse.json(
          { error: "You are not authorized to update this customer." },
          { status: 403 }
        );
      }
    }

    const updatedCustomer = await db.customer.update({
      where: { id: String(id) },
      data: { name, email, phone, address, companyName },
    });

    if (!updatedCustomer) {
      return NextResponse.json(
        { message: "Customer not found" },
        { status: 404 }
      );
    }

    // Update all invoices associated with this customer to reflect the updated information
    await db.invoice.updateMany({
      where: { customerId: id },
      data: {
        customerName: updatedCustomer.name,
        customerCompanyName: updatedCustomer.companyName,
        customerPhone: updatedCustomer.phone,
        customerEmail: updatedCustomer.email,
        customerAddress: updatedCustomer.address,
      },
    });

    // Update all payments associated with this customer
    await db.payment.updateMany({
      where: { customerEmail: updatedCustomer.email },
      data: {
        customerName: updatedCustomer.name,
        customerCompanyName: updatedCustomer.companyName,
        customerPhone: updatedCustomer.phone,
        customerEmail: updatedCustomer.email,
        customerAddress: updatedCustomer.address,
      },
    });

    return NextResponse.json(
      {
        message: "Customer and related invoices, payments updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update customer, invoices, and payments" },
      { status: 500 }
    );
  }
}
