import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { UserSchema } from "@/schemas";
import { checkAuth } from "@/lib/auth";
import { getUserByEmail } from "@/helpers/user-data";

export const config = {
  runtime: "nodejs",
};

export async function POST(request: Request) {
  const { authenticated, session } = await checkAuth();

  if (!authenticated || session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const userData = await request.json();

    const result = UserSchema.safeParse(userData);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid user data.", details: result.error.errors },
        { status: 400 }
      );
    }

    const { name, email, password, role, companyName } = result.data;

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        companyName: companyName || null,
      },
    });

    await db.account.create({
      data: {
        userId: user.id,
        provider: "credentials",
        providerAccountId: user.id,
        type: "credentials",
      },
    });

    //return NextResponse.json(user, { status: 201 });

    return NextResponse.json(
      {
        message: "User created successfully!",
        newUser: user,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "An error occurred while creating the user. Please try again later.",
      },
      { status: 500 }
    );
  }
}
