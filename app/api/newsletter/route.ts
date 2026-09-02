import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

const subscriberSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  topics: z.array(z.string()).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = subscriberSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid email format provided" },
        { status: 400 }
      );
    }

    const { email, topics } = result.data;
    const cleanEmail = email.toLowerCase().trim();

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      if (existing.status === "UNSUBSCRIBED") {
        await prisma.newsletterSubscriber.update({
          where: { email: cleanEmail },
          data: {
            status: "ACTIVE",
            topics: (topics || existing.topics) as any,
          },
        });
        return NextResponse.json({
          success: true,
          message: "Welcome back! Your subscription has been reactivated.",
        });
      }

      return NextResponse.json({
        success: true,
        message: "You are already subscribed to the Impact Makers Journal.",
      });
    }

    await prisma.newsletterSubscriber.create({
      data: {
        email: cleanEmail,
        topics: (topics || []) as any,
        status: "ACTIVE",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for subscribing to the Impact Makers Executive Dispatch.",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[Newsletter Subscription Error]", err);
    return NextResponse.json(
      { error: "Failed to complete newsletter subscription" },
      { status: 500 }
    );
  }
}
