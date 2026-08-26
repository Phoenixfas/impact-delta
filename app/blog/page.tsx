import type { Metadata } from "next";
import BlogHero from "@/components/BlogHero";
import BlogToolbar from "@/components/BlogToolbar";
import BlogGrid from "@/components/BlogGrid";
import BlogNewsletter from "@/components/BlogNewsletter";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "Impact Journal & Insights | IMPACT B2B — Spatial Event Architecture",
  description:
    "Explore peer-reviewed engineering insights, kinetic show control masterclasses, and executive summit architectural blueprints from Impact B2B.",
};

export default function BlogPage() {
  return (
    <div className="relative w-full flex flex-col items-center">
      <BlogHero />
      <BlogToolbar />
      <BlogGrid />
      <BlogNewsletter />
      <CTA />
    </div>
  );
}
