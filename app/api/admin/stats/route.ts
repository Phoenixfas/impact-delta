import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [
      totalInquiries,
      newInquiries,
      totalBriefs,
      activeBriefs,
      wonBriefs,
      totalSubscribers,
      recentBriefs,
      recentInquiries,
    ] = await Promise.all([
      prisma.contactInquiry.count(),
      prisma.contactInquiry.count({ where: { status: "NEW" } }),
      prisma.standBrief.count(),
      prisma.standBrief.count({
        where: {
          status: { in: ["SUBMITTED", "IN_REVIEW", "PROPOSAL_SENT"] },
        },
      }),
      prisma.standBrief.count({ where: { status: "WON" } }),
      prisma.newsletterSubscriber.count({ where: { status: "ACTIVE" } }),
      prisma.standBrief.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          referenceCode: true,
          companyName: true,
          eventName: true,
          status: true,
          budget: true,
          currency: true,
          createdAt: true,
        },
      }),
      prisma.contactInquiry.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          subject: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    const conversionRate =
      totalBriefs > 0 ? ((wonBriefs / totalBriefs) * 100).toFixed(1) : "0.0";

    return NextResponse.json({
      stats: {
        totalInquiries,
        newInquiries,
        totalBriefs,
        activeBriefs,
        wonBriefs,
        conversionRate: `${conversionRate}%`,
        totalSubscribers,
      },
      recentActivity: {
        briefs: recentBriefs,
        inquiries: recentInquiries,
      },
    });
  } catch (err) {
    console.error("[GET /api/admin/stats Error]", err);
    return NextResponse.json(
      { error: "Failed to load dashboard metrics" },
      { status: 500 }
    );
  }
}
