import type { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import {
  getBlogPostBySlug,
  getAllBlogSlugs,
  mapPrismaToDetailedBlogPost,
  DetailedBlogPost,
} from "@/lib/blog-posts";
import ArticleDetail from "@/components/ArticleDetail";

export const dynamicParams = true;
export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getArticleData(slug: string): Promise<DetailedBlogPost | null> {
  try {
    const dbPost = await prisma.blogPost.findUnique({
      where: { slug },
      include: {
        author: {
          select: { id: true, name: true, role: true, email: true },
        },
      },
    });

    if (dbPost && dbPost.published) {
      return mapPrismaToDetailedBlogPost(dbPost);
    }
  } catch (err) {
    console.error("Failed to query blog post from DB:", err);
  }

  // Fallback to static dictionary
  return getBlogPostBySlug(slug) || null;
}

export async function generateStaticParams() {
  try {
    const dbPosts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true },
    });
    if (dbPosts.length > 0) {
      return dbPosts.map((p) => ({ slug: p.slug }));
    }
  } catch {
    // If DB is offline during build, fallback to static slugs
  }
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getArticleData(slug);

  if (!post) {
    return {
      title: "Article Not Found | Impact Makers Events Journal",
    };
  }

  return {
    title: `${post.title} | Impact Makers Events Journal`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author.name],
      images: [
        {
          url: post.heroImage,
          alt: post.heroImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.heroImage],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getArticleData(slug);

  if (!post) {
    notFound();
  }

  return <ArticleDetail post={post} />;
}
