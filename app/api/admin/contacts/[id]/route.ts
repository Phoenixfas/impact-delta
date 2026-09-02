import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!["NEW", "CONTACTED", "CLOSED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    const updated = await prisma.contactInquiry.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      inquiry: updated,
      message: `Inquiry status updated to ${status}`,
    });
  } catch (err) {
    console.error("[PATCH /api/admin/contacts/[id] Error]", err);
    return NextResponse.json(
      { error: "Failed to update inquiry status" },
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
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only administrators can delete inquiries" },
        { status: 403 }
      );
    }

    const { id } = await params;
    await prisma.contactInquiry.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Contact inquiry deleted successfully",
    });
  } catch (err) {
    console.error("[DELETE /api/admin/contacts/[id] Error]", err);
    return NextResponse.json(
      { error: "Failed to delete inquiry" },
      { status: 500 }
    );
  }
}
