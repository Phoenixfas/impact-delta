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
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "15", 10)));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
        { subject: { contains: search } },
        { message: { contains: search } },
      ];
    }

    // CSV Export
    if (isExport) {
      const allContacts = await prisma.contactInquiry.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });

      const headers = ["ID", "Status", "Name", "Email", "Phone", "Subject", "Message", "Submitted At"];
      const rows = allContacts.map((c) => [
        c.id,
        c.status,
        c.name,
        c.email,
        c.phone || "",
        c.subject || "",
        c.message,
        new Date(c.createdAt).toISOString(),
      ]);

      const csvData = generateCsv(headers, rows);

      return new NextResponse(csvData, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="contact-inquiries-${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      });
    }

    const [inquiries, total] = await Promise.all([
      prisma.contactInquiry.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.contactInquiry.count({ where }),
    ]);

    return NextResponse.json({
      inquiries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("[GET /api/admin/contacts Error]", err);
    return NextResponse.json(
      { error: "Failed to retrieve contact inquiries" },
      { status: 500 }
    );
  }
}
