import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { UserSchema } from "@/schemas";
import { checkAuth } from "@/lib/auth";

export const config = {
  runtime: "nodejs",
};

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { authenticated, session } = await checkAuth();

  if (!authenticated || session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const userData = await request.json();

    const result = UserSchema.safeParse(userData);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid user data", details: result.error.errors },
        { status: 400 }
      );
    }

    const { name, email, password, role, companyName } = result.data;

    const existingUser = await db.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updateData: any = {
      ...(name && { name }),
      ...(email && { email }),
      ...(role && { role }),
      ...(companyName && { companyName }),
    };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await db.user.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(
      { message: "User updated successfully", updatedUser },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Error updating user" }, { status: 500 });
  }
}
