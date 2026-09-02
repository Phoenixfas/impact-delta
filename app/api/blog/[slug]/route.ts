import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!post || !post.published) {
      return NextResponse.json(
        { error: "Article not found or not published" },
        { status: 404 }
      );
    }

    return NextResponse.json({ post });
  } catch (err) {
    console.error("[GET /api/blog/[slug] Error]", err);
    return NextResponse.json(
      { error: "Failed to retrieve article" },
      { status: 500 }
    );
  }
}
