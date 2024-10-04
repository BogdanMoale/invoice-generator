import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAuth } from "@/lib/auth";

export async function GET(request: Request) {
  const { authenticated, response, session } = await checkAuth();

  if (!authenticated) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 }
    );
  }

  // Extract query parameters for pagination
  const url = new URL(request.url);
  const skipParam = url.searchParams.get("skip");
  const takeParam = url.searchParams.get("take");

  const skip = skipParam ? parseInt(skipParam, 10) : null;
  const take = takeParam ? parseInt(takeParam, 10) : null;

  try {
    let customers;
    let totalCount;

    // Role-based logic
    if (session?.user.role === "ADMIN") {
      customers = await db.customer.findMany({
        ...(skip !== null && take !== null ? { skip, take } : {}),
        include: {
          users: {
            include: {
              user: true,
            },
          },
        },
      });

      totalCount = await db.customer.count();
    } else if (session?.user.role === "USER") {
      // USER: Fetch customers associated with this user via UserCustomer relation
      customers = await db.customer.findMany({
        where: {
          users: {
            some: {
              userId: session?.user.id, // Fetch customers associated with this user
            },
          },
        },
        ...(skip !== null && take !== null ? { skip, take } : {}),
      });

      totalCount = await db.customer.count({
        where: {
          users: {
            some: {
              userId: session?.user.id,
            },
          },
        },
      });
    } else if (session?.user.role === "CUSTOMER") {
      // CUSTOMER: Fetch only their own customer profile
      const customer = await db.customer.findFirst({
        where: {
          email: session?.user.email ?? "",
        },
      });

      customers = customer ? [customer] : [];
      totalCount = customers.length;
    }

    return NextResponse.json({ customers, totalCount }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching customers" },
      { status: 500 }
    );
  }
}
