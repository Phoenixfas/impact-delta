import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { generateCsv } from "@/lib/export-csv";

function formatArrayOrJson(val: any): string {
  if (!val) return "N/A";
  if (Array.isArray(val)) {
    const list = val
      .map((item) => {
        if (typeof item === "string") return item;
        if (typeof item === "object" && item !== null) {
          return item.label || item.name || item.title || JSON.stringify(item);
        }
        return String(item);
      })
      .filter(Boolean);
    return list.length > 0 ? list.join("; ") : "N/A";
  }
  if (typeof val === "object") {
    const active = Object.entries(val)
      .filter(([, v]) => v === true || (typeof v === "string" && v) || (typeof v === "number" && v > 0))
      .map(([k, v]) => {
        const readableKey = k
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase())
          .trim();
        return typeof v === "boolean" ? readableKey : `${readableKey}: ${v}`;
      });
    return active.length > 0 ? active.join("; ") : "None specified";
  }
  return String(val);
}

function formatProductFiles(val: any): string {
  if (!val || !Array.isArray(val) || val.length === 0) return "No attachments";
  return val
    .map((f: any) => {
      if (typeof f === "string") return f;
      const name = f.name || "Attachment";
      const preview = f.preview || f.url || "";
      const size = f.size ? ` (${f.size})` : "";
      return preview ? `${name}${size} [${preview}]` : `${name}${size}`;
    })
    .join(" | ");
}

function formatInternalNotes(val: any): { count: number; latest: string } {
  if (!val || !Array.isArray(val) || val.length === 0) {
    return { count: 0, latest: "None" };
  }
  const count = val.length;
  const latestNote = val[val.length - 1];
  const latestStr = latestNote
    ? `[${latestNote.authorName || "Team"} - ${latestNote.createdAt?.slice(0, 10) || ""}]: ${latestNote.text || ""}`
    : "None";
  return { count, latest: latestStr };
}

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const salesId = searchParams.get("salesId") || "";
    const isExport = searchParams.get("export") === "csv";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "15", 10)));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (salesId && salesId !== "ALL") {
      where.assignedSalesId = salesId;
    }

    if (search) {
      where.OR = [
        { referenceCode: { contains: search } },
        { companyName: { contains: search } },
        { eventName: { contains: search } },
        { contactPerson: { contains: search } },
        { email: { contains: search } },
        { contactNumber: { contains: search } },
      ];
    }

    // CSV Full Export Mode
    if (isExport) {
      const allBriefs = await prisma.standBrief.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
          assignedSales: { select: { name: true, email: true } },
        },
      });

      const headers = [
        "Reference Code",
        "Status",
        "Submission Date",
        "Last Updated",
        "Assigned Sales Rep",
        "Assigned Sales Email",
        // Step 1: Company & Stand Coordinates
        "Event Name",
        "Company Name",
        "Contact Person",
        "Contact Number",
        "Email Address",
        "Website",
        "Stand Location / Hall",
        "Stand Size",
        "Stand Type",
        "Floor Plan Attachment URL",
        // Step 2: Objectives, Budget & Products
        "Primary Exhibition Goals",
        "Other Goals Details",
        "Preferred Color Scheme",
        "Budget Currency",
        "Allocated Budget",
        "Products / Services Description",
        "Product Spec Attachments",
        // Step 3: Display & Meeting Architecture
        "Display Items & Counters",
        "Meeting Area Type",
        "Meeting Capacity",
        "Other Meeting Details",
        "Additional Meeting Notes",
        // Step 4: Stand Design & Spatial
        "Above Stand & Rigging Options",
        "Flooring Option",
        "Carpet Color",
        "Store Room Size",
        "Store Room Notes",
        // Step 5: AV & Venue Services
        "LED Screen Quantity",
        "LED Screen Size",
        "Venue Services Required",
        "AV & Technical Notes",
        // Step 6: Additional Services & Notes
        "Special Requirements (Personnel/Catering/Cleaning)",
        "Additional Comments / Scope Notes",
        // Internal Workflow
        "Internal Notes Count",
        "Latest Internal Note",
      ];

      const rows = allBriefs.map((b) => {
        const notesInfo = formatInternalNotes(b.internalNotes);

        return [
          b.referenceCode,
          b.status,
          new Date(b.createdAt).toISOString(),
          new Date(b.updatedAt).toISOString(),
          b.assignedSales?.name || "Unassigned",
          b.assignedSales?.email || "N/A",
          // Step 1
          b.eventName,
          b.companyName,
          b.contactPerson,
          b.contactNumber,
          b.email,
          b.website || "N/A",
          b.standLocation,
          b.standSize,
          b.standType,
          b.floorPlanUrl || "None attached",
          // Step 2
          formatArrayOrJson(b.primaryGoals),
          b.otherGoalDetails || "N/A",
          b.colorScheme,
          b.currency,
          b.budget,
          b.productsDescription,
          formatProductFiles(b.productFiles),
          // Step 3
          formatArrayOrJson(b.displayItems),
          b.meetingAreaType,
          b.meetingCapacity || "N/A",
          b.otherMeetingDetails || "N/A",
          b.additionalMeetingNotes || "N/A",
          // Step 4
          formatArrayOrJson(b.aboveStandOptions),
          b.flooringOption || "N/A",
          b.carpetColor || "N/A",
          b.storeRoomSize || "N/A",
          b.storeRoomNotes || "N/A",
          // Step 5
          b.ledScreenQty.toString(),
          b.ledScreenSize || "None",
          formatArrayOrJson(b.venueServices),
          b.avAdditionalNotes || "N/A",
          // Step 6
          formatArrayOrJson(b.specialRequirements),
          b.additionalComments || "N/A",
          // Internal Workflow
          notesInfo.count.toString(),
          notesInfo.latest,
        ];
      });

      const csvData = generateCsv(headers, rows);

      return new NextResponse(csvData, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="stand-briefs-full-export-${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      });
    }

    // Standard Paginated List
    const [briefs, total] = await Promise.all([
      prisma.standBrief.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          assignedSales: {
            select: { id: true, name: true, email: true, role: true },
          },
        },
      }),
      prisma.standBrief.count({ where }),
    ]);

    return NextResponse.json({
      briefs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("[GET /api/admin/briefs Error]", err);
    return NextResponse.json(
      { error: "Failed to fetch stand briefs" },
      { status: 500 }
    );
  }
}
