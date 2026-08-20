import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";

export default function Home() {
  return (
    <div className="relative w-full min-h-screen flex flex-col items-center">
      <Navbar />
      <HeroSection />
    </div>
  );
}
