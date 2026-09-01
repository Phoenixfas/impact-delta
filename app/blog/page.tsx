import type { Metadata } from "next";
import BlogHero from "@/components/BlogHero";
import BlogToolbar from "@/components/BlogToolbar";
import BlogGrid from "@/components/BlogGrid";
import BlogNewsletter from "@/components/BlogNewsletter";
import CTA from "@/components/CTA";

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
