import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const brief = await prisma.standBrief.findUnique({
      where: { id },
      include: {
        assignedSales: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!brief) {
      return NextResponse.json({ error: "Stand brief not found" }, { status: 404 });
    }

    return NextResponse.json({ brief });
  } catch (err) {
    console.error("[GET /api/admin/briefs/[id] Error]", err);
    return NextResponse.json(
      { error: "Failed to retrieve stand brief details" },
      { status: 500 }
    );
  }
}

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
    const { status, assignedSalesId, noteText } = body;

    const currentBrief = await prisma.standBrief.findUnique({
      where: { id },
    });

    if (!currentBrief) {
      return NextResponse.json({ error: "Stand brief not found" }, { status: 404 });
    }

    const updateData: any = {};

    if (status) {
      updateData.status = status;
    }

    if (assignedSalesId !== undefined) {
      updateData.assignedSalesId = assignedSalesId || null;
    }

    if (noteText && typeof noteText === "string" && noteText.trim()) {
      const existingNotes = Array.isArray(currentBrief.internalNotes)
        ? (currentBrief.internalNotes as any[])
        : [];

      const newNote = {
        id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        text: noteText.trim(),
        authorName: session.name,
        authorRole: session.role,
        createdAt: new Date().toISOString(),
      };

      updateData.internalNotes = [...existingNotes, newNote];
    }

    const updatedBrief = await prisma.standBrief.update({
      where: { id },
      data: updateData,
      include: {
        assignedSales: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      brief: updatedBrief,
      message: "Stand brief updated successfully",
    });
  } catch (err) {
    console.error("[PATCH /api/admin/briefs/[id] Error]", err);
    return NextResponse.json(
      { error: "Failed to update stand brief" },
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
        { error: "Only administrators can delete stand briefs" },
        { status: 403 }
      );
    }

    const { id } = await params;
    await prisma.standBrief.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Stand brief deleted successfully",
    });
  } catch (err) {
    console.error("[DELETE /api/admin/briefs/[id] Error]", err);
    return NextResponse.json(
      { error: "Failed to delete stand brief" },
      { status: 500 }
    );
  }
}
