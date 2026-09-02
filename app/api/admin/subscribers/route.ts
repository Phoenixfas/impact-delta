import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { generateCsv } from "@/lib/export-csv";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const isExport = searchParams.get("export") === "csv";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (search) {
      where.email = { contains: search };
    }

    // CSV Export
    if (isExport) {
      const allSubscribers = await prisma.newsletterSubscriber.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });

      const headers = ["ID", "Email", "Status", "Topics", "Subscribed At"];
      const rows = allSubscribers.map((s) => [
        s.id,
        s.email,
        s.status,
        Array.isArray(s.topics) ? (s.topics as string[]).join(", ") : "",
        new Date(s.createdAt).toISOString(),
      ]);

      const csvData = generateCsv(headers, rows);

      return new NextResponse(csvData, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      });
    }

    const [subscribers, total] = await Promise.all([
      prisma.newsletterSubscriber.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.newsletterSubscriber.count({ where }),
    ]);

    return NextResponse.json({
      subscribers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("[GET /api/admin/subscribers Error]", err);
    return NextResponse.json(
      { error: "Failed to retrieve subscribers" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !["ACTIVE", "UNSUBSCRIBED"].includes(status)) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const updated = await prisma.newsletterSubscriber.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      subscriber: updated,
      message: `Subscriber status set to ${status}`,
    });
  } catch (err) {
    console.error("[PATCH /api/admin/subscribers Error]", err);
    return NextResponse.json(
      { error: "Failed to update subscriber status" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only administrators can delete subscribers" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Subscriber ID required" }, { status: 400 });
    }

    await prisma.newsletterSubscriber.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Subscriber removed successfully",
    });
  } catch (err) {
    console.error("[DELETE /api/admin/subscribers Error]", err);
    return NextResponse.json(
      { error: "Failed to delete subscriber" },
      { status: 500 }
    );
  }
}
