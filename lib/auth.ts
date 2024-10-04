import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const currentUser = async () => {
  const session = await auth();

  return session?.user;
};

export async function checkAuth() {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      ),
    };
  }

  return { authenticated: true, session };
}
