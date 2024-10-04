import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { CustomerSchema } from "@/schemas";
import { checkAuth } from "@/lib/auth";

export async function POST(request: Request) {
  const { authenticated, response, session } = await checkAuth();

  if (!authenticated) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 }
    );
  }

  if (session?.user.role === "CUSTOMER") {
    return NextResponse.json(
      { error: "You are not authorized to create new customers." },
      { status: 403 }
    );
  }

  try {
    const customerData = await request.json();
    const result = CustomerSchema.safeParse(customerData);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid customer data.", details: result.error.errors },
        { status: 400 }
      );
    }

    const { name, companyName, email, phone, address } = result.data;

    const customer = await db.customer.create({
      data: {
        name,
        companyName,
        email,
        phone,
        address,
      },
    });

    // Link the created customer to the user via the UserCustomer junction table
    await db.userCustomer.create({
      data: {
        userId: session?.user?.id ?? "",
        customerId: customer.id,
      },
    });

    return NextResponse.json(
      {
        message: "Customer created successfully!",
        customer,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "An error occurred while creating the customer. Please try again later.",
      },
      { status: 500 }
    );
  }
}
