import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { sendContactNotification } from "@/lib/email";

const contactSchema = z.object({
  fullName: z.string().optional(),
  name: z.string().optional(),
  email: z.string().email("Please provide a valid work email"),
  phone: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  subject: z.string().optional().nullable(),
  preferredMethod: z.string().optional().nullable(),
  message: z.string().min(3, "Message must be at least 3 characters"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { fullName, name, email, phone, company, subject, preferredMethod, message } =
      result.data;

    const resolvedName = (name || fullName || "").trim();
    if (!resolvedName || resolvedName.length < 2) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: { name: ["Full name must be at least 2 characters"] },
        },
        { status: 400 }
      );
    }

    // Build rich message context if company or preferredMethod provided
    let richMessage = message.trim();
    const meta: string[] = [];
    if (company && company.trim()) meta.push(`🏢 Company: ${company.trim()}`);
    if (preferredMethod && preferredMethod.trim()) {
      meta.push(`📞 Preferred Response Channel: ${preferredMethod.toUpperCase()}`);
    }

    if (meta.length > 0) {
      richMessage = `${meta.join("\n")}\n\n📝 Project Scope & Notes:\n${richMessage}`;
    }

    const inquiry = await prisma.contactInquiry.create({
      data: {
        name: resolvedName,
        email: email.toLowerCase().trim(),
        phone: phone && phone.trim() ? phone.trim() : null,
        subject: subject && subject.trim() ? subject.trim() : "General Exhibition Inquiry",
        message: richMessage,
        status: "NEW",
      },
    });

    // Fire & forget email notification (won't fail API if SMTP is down)
    sendContactNotification({
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone,
      subject: inquiry.subject,
      message: inquiry.message,
    }).catch((err) => console.error("[Contact Email Trigger Error]", err));

    return NextResponse.json(
      {
        success: true,
        id: inquiry.id,
        message: "Thank you. Your inquiry has been received by our engineering desk.",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/contact Error]", err);
    return NextResponse.json(
      { error: "Internal server error while processing your inquiry." },
      { status: 500 }
    );
  }
}
