import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getSession, hashPassword } from "@/lib/auth";

const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role: z.enum(["ADMIN", "SALES"]).optional(),
  password: z.string().min(6).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Admin privileges required" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const result = updateUserSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = result.data;
    const updatePayload: any = {};

    if (data.name) updatePayload.name = data.name;
    if (data.role) updatePayload.role = data.role;
    if (data.email) {
      const cleanEmail = data.email.toLowerCase().trim();
      const existing = await prisma.user.findFirst({
        where: { email: cleanEmail, NOT: { id } },
      });
      if (existing) {
        return NextResponse.json(
          { error: "Another user already uses this email address" },
          { status: 400 }
        );
      }
      updatePayload.email = cleanEmail;
    }

    if (data.password) {
      updatePayload.passwordHash = await hashPassword(data.password);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updatePayload,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: updated,
      message: "User account updated successfully",
    });
  } catch (err) {
    console.error("[PATCH /api/admin/users/[id] Error]", err);
    return NextResponse.json(
      { error: "Failed to update user account" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Admin privileges required" },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Prevent self-deletion
    if (id === session.id) {
      return NextResponse.json(
        { error: "You cannot delete your own administrative account" },
        { status: 400 }
      );
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "User account deleted successfully",
    });
  } catch (err) {
    console.error("[DELETE /api/admin/users/[id] Error]", err);
    return NextResponse.json(
      { error: "Failed to delete user account" },
      { status: 500 }
    );
  }
}
