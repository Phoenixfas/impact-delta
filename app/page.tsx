import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";

export default function Home() {
  return (
    <div className="relative w-full min-h-screen flex flex-col items-center">
      <Navbar />
      <HeroSection />
      <AboutSection />
    </div>
  );
}
