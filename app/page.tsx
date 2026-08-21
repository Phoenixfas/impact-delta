import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import AchievementsSection from "@/components/AchievementsSection";
import ProjectsSection from "@/components/ProjectsSection";
import ServicesSection from "@/components/ServicesSection";
import ShowreelSection from "@/components/ShowreelSection";

export default function Home() {
  return (
    <div className="relative w-full min-h-screen flex flex-col items-center">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <AchievementsSection />
      <ProjectsSection />
      <ServicesSection />
      <ShowreelSection />
    </div>
  );
}
