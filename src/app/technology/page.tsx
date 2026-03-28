import PipelineOverview from "@/components/technology/PipelineOverview";
import AIModules from "@/components/technology/AIModules";
import DataVisualization from "@/components/technology/DataVisualization";
import WhyNeuralSky from "@/components/technology/WhyNeuralSky";

export const metadata = {
  title: "Technology   NeuralSky",
  description: "Deep-tech AI pipeline for telescope survey analysis and anomaly detection.",
};

export default function TechnologyPage() {
  return (
    <>
      <PipelineOverview />
      <AIModules />
      <DataVisualization />
      <WhyNeuralSky />
    </>
  );
}
