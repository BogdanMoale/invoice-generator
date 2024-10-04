import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAuth } from "@/lib/auth";

export async function GET(request: Request) {
  const { authenticated, response, session } = await checkAuth();

  if (!authenticated || !session) {
    return response;
  }

  const url = new URL(request.url);
  const skipParam = url.searchParams.get("skip");
  const takeParam = url.searchParams.get("take");

  const skip = skipParam ? parseInt(skipParam, 10) : 0;
  const take = takeParam ? parseInt(takeParam, 10) : 10;

  try {
    let payments;
    let totalCount;

    // Role-based access control
    if (session?.user.role === "ADMIN") {
      // ADMIN: Can fetch all payments
      payments = await db.payment.findMany({
        include: {
          invoice: true,
        },
        skip,
        take,
      });

      totalCount = await db.payment.count();
    } else if (session?.user.role === "USER") {
      // USER: Can only fetch payments for invoices they created
      payments = await db.payment.findMany({
        where: {
          invoice: {
            userId: session.user.id,
          },
        },
        include: {
          invoice: true,
        },
        skip,
        take,
      });

      totalCount = await db.payment.count({
        where: {
          invoice: {
            userId: session.user.id,
          },
        },
      });
    } else if (session?.user.role === "CUSTOMER") {
      // CUSTOMER: Can only fetch payments for invoices associated with their email
      payments = await db.payment.findMany({
        where: {
          customerEmail: session.user.email ?? "",
        },
        include: {
          invoice: true,
        },
        skip,
        take,
      });

      totalCount = await db.payment.count({
        where: {
          customerEmail: session.user.email ?? "",
        },
      });
    }

    return NextResponse.json({ payments, totalCount }, { status: 200 });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { error: "Error fetching payments" },
      { status: 500 }
    );
  }
}
