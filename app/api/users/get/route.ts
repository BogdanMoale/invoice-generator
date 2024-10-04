import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAuth } from "@/lib/auth";

export async function GET(request: Request) {
  const { authenticated, response, session } = await checkAuth();

  if (!authenticated) {
    return response;
  }

  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const url = new URL(request.url);
  const skipParam = url.searchParams.get("skip");
  const takeParam = url.searchParams.get("take");

  const skip = skipParam ? parseInt(skipParam, 10) : null;
  const take = takeParam ? parseInt(takeParam, 10) : null;

  try {
    // Determine whether to apply pagination
    const users = await db.user.findMany({
      ...(skip !== null && take !== null ? { skip, take } : {}),
    });

    const totalCount = await db.user.count();

    return NextResponse.json({ users, totalCount }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching users" },
      { status: 500 }
    );
  }
}
