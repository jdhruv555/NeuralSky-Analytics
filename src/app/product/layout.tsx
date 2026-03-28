import type { Metadata } from "next";
import ProductShell from "@/components/product/shell/ProductShell";

export const metadata: Metadata = {
  title: "Product · NeuralSky Space Analytics",
  description:
    "NeuralSky product workspace — telescopic surveys, ingestion, anomaly detection, and review.",
};

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <ProductShell>{children}</ProductShell>;
}
