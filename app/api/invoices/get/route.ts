import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAuth } from "@/lib/auth";

export async function GET(request: Request) {
  const { authenticated, response, session } = await checkAuth();

  if (!authenticated) {
    return response;
  }

  const url = new URL(request.url);
  const skipParam = url.searchParams.get("skip");
  const takeParam = url.searchParams.get("take");

  const skip = skipParam ? parseInt(skipParam, 10) : 0;
  const take = takeParam ? parseInt(takeParam, 10) : 10;

  try {
    let invoices;
    let totalCount;

    if (session?.user.role === "ADMIN") {
      // ADMIN: Fetch all invoices
      invoices = await db.invoice.findMany({
        include: {
          customer: true,
          items: true,
        },
        skip,
        take,
      });

      totalCount = await db.invoice.count();
    } else if (session?.user.role === "USER") {
      // USER: Fetch invoices created by this user
      invoices = await db.invoice.findMany({
        where: { userId: session?.user.id },
        include: {
          customer: true,
          items: true,
        },
        skip,
        take,
      });

      totalCount = await db.invoice.count({
        where: { userId: session?.user.id },
      });
    } else if (session?.user.role === "CUSTOMER") {
      // CUSTOMER: Fetch invoices sent to this customer by their email (redundant field)
      invoices = await db.invoice.findMany({
        where: {
          customerEmail: session?.user.email ?? "", // Use customerEmail to fetch even if customerId is null
        },
        include: {
          customer: true,
          items: true,
        },
        skip,
        take,
      });

      totalCount = await db.invoice.count({
        where: {
          customerEmail: session?.user.email ?? "",
        },
      });
    }

    // Format invoices with company name, using the redundant customer fields
    const invoicesWithCompanyName = (invoices ?? []).map((invoice) => ({
      ...invoice,
      customerCompanyName: invoice.customer
        ? invoice.customer.companyName
        : invoice.customerCompanyName,
    }));

    return NextResponse.json(
      { invoices: invoicesWithCompanyName, totalCount },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      { error: "Error fetching invoices" },
      { status: 500 }
    );
  }
}
