import AboutSection from "@/components/about/AboutSection";
import TeamSection from "@/components/about/TeamSection";
import VisionSection from "@/components/about/VisionSection";

export const metadata = {
  title: "About   NeuralSky",
  description: "Meet the team behind NeuralSky   the space data analytics platform built for the next era of astronomical discovery.",
};

export default function AboutPage() {
  return (
    <>
      <AboutSection />
      <TeamSection />
      <VisionSection />
    </>
  );
}
