import { Hero, DashboardShowcase } from "@/components/home/HomeClient";
import HowItWorks from "@/components/home/HowItWorks";
import UseCases from "@/components/home/UseCases";
import Stats from "@/components/home/Stats";
import FinalCTA from "@/components/home/FinalCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <DashboardShowcase />
      <UseCases />
      <Stats />
      <FinalCTA />
    </>
  );
}
