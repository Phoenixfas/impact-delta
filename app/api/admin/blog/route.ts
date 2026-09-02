import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const blogPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(2, "Slug is required"),
  excerpt: z.string().min(10, "Excerpt is required"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  coverImage: z.string().optional().nullable(),
  category: z.string().min(2, "Category is required"),
  tags: z.array(z.string()).optional(),
  readingTime: z.string().optional(),
  published: z.boolean().default(true),
});

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const published = searchParams.get("published");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "15", 10)));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (category && category !== "ALL") {
      where.category = category;
    }

    if (published !== null && published !== undefined && published !== "") {
      where.published = published === "true";
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
        { slug: { contains: search } },
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
      prisma.blogPost.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("[GET /api/admin/blog Error]", err);
    return NextResponse.json(
      { error: "Failed to load blog posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only administrators can create articles" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const result = blogPostSchema.safeParse(body);

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

    // Check slug uniqueness
    const existingSlug = await prisma.blogPost.findUnique({
      where: { slug: data.slug },
    });

    if (existingSlug) {
      return NextResponse.json(
        { error: "An article with this URL slug already exists" },
        { status: 400 }
      );
    }

    // Auto calculate reading time if not provided
    const words = data.content.split(/\s+/).length;
    const calcReadingTime = data.readingTime || `${Math.max(1, Math.ceil(words / 200))} min read`;

    const post = await prisma.blogPost.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.coverImage || null,
        category: data.category,
        tags: (data.tags || []) as any,
        readingTime: calcReadingTime,
        published: data.published,
        authorId: session.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        post,
        message: "Article published successfully",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/admin/blog Error]", err);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}
