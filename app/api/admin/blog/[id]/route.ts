import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const blogPostUpdateSchema = z.object({
  title: z.string().min(3).optional(),
  slug: z.string().min(2).optional(),
  excerpt: z.string().min(10).optional(),
  content: z.string().min(20).optional(),
  coverImage: z.string().optional().nullable(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  readingTime: z.string().optional(),
  published: z.boolean().optional(),
});

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

    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (err) {
    console.error("[GET /api/admin/blog/[id] Error]", err);
    return NextResponse.json(
      { error: "Failed to retrieve article" },
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

    if (session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only administrators can edit articles" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const result = blogPostUpdateSchema.safeParse(body);

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

    if (data.slug) {
      const existingSlug = await prisma.blogPost.findFirst({
        where: {
          slug: data.slug,
          NOT: { id },
        },
      });

      if (existingSlug) {
        return NextResponse.json(
          { error: "Another article already uses this slug" },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.blogPost.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.slug && { slug: data.slug }),
        ...(data.excerpt && { excerpt: data.excerpt }),
        ...(data.content && { content: data.content }),
        ...(data.coverImage !== undefined && { coverImage: data.coverImage }),
        ...(data.category && { category: data.category }),
        ...(data.tags && { tags: data.tags as any }),
        ...(data.readingTime && { readingTime: data.readingTime }),
        ...(data.published !== undefined && { published: data.published }),
      },
    });

    return NextResponse.json({
      success: true,
      post: updated,
      message: "Article updated successfully",
    });
  } catch (err) {
    console.error("[PATCH /api/admin/blog/[id] Error]", err);
    return NextResponse.json(
      { error: "Failed to update article" },
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
        { error: "Only administrators can delete articles" },
        { status: 403 }
      );
    }

    const { id } = await params;
    await prisma.blogPost.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (err) {
    console.error("[DELETE /api/admin/blog/[id] Error]", err);
    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 500 }
    );
  }
}
