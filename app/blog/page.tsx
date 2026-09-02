import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import BlogHero from "@/components/BlogHero";
import BlogToolbar from "@/components/BlogToolbar";
import BlogGrid, { BlogPost } from "@/components/BlogGrid";
import BlogNewsletter from "@/components/BlogNewsletter";
import CTA from "@/components/CTA";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Exhibition & Event Insights Journal | Impact Makers Events L.L.C",
  description:
    "Expert insights on DWTC/DEC stand guidelines, in-house CNC joinery, Triple ISO standards, international congress organizing, and AV technology from Impact Makers Events L.L.C.",
  openGraph: {
    title: "Exhibition & Event Insights | Impact Makers Events L.L.C",
    description:
      "Expert guides on exhibition booth fabrication, DWTC permits, in-house CNC carpentry, and international event organizing across Dubai and 9 global hubs.",
    url: "https://www.impactmakersevents.com/blog",
  },
};

async function getPublishedPosts(): Promise<BlogPost[]> {
  try {
    const dbPosts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { id: true, name: true, role: true, email: true },
        },
      },
    });

    if (dbPosts.length > 0) {
      return dbPosts.map((p) => {
        const category = p.category || "Stand Fabrication";
        let categoryColor = "blue";
        if (category.toLowerCase().includes("event")) categoryColor = "emerald";
        else if (category.toLowerCase().includes("av") || category.toLowerCase().includes("production")) categoryColor = "indigo";
        else if (category.toLowerCase().includes("guideline") || category.toLowerCase().includes("dwtc")) categoryColor = "amber";

        const tags = Array.isArray(p.tags) ? (p.tags as string[]) : [];

        return {
          id: p.id,
          slug: p.slug,
          title: p.title,
          excerpt: p.excerpt,
          category,
          categoryLabel: category,
          categoryColor,
          tags: tags.length > 0 ? tags : [category],
          readTime: p.readingTime || "6 Min Read",
          date: new Date(p.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          author: {
            name: p.author?.name || "Tariq Al-Mansoor",
            role: p.author?.role === "ADMIN" ? "Managing Director & Founder" : "Senior Event Director",
            avatar: "/images/team/marcus-chen.jpg",
          },
          image: p.coverImage || "/images/prev/booth_1.webp",
          imageAlt: p.title,
          featured: false,
          editorialBadge: category.toUpperCase(),
        };
      });
    }
  } catch (err) {
    console.error("Failed to fetch published posts from database in BlogPage:", err);
  }

  return [];
}

export default async function BlogPage() {
  const initialPosts = await getPublishedPosts();

  return (
    <div className="relative w-full flex flex-col items-center">
      <BlogHero />
      <BlogToolbar />
      <BlogGrid initialPosts={initialPosts} />
      <BlogNewsletter />
      <CTA />
    </div>
  );
}
