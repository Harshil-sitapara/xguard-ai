import { Metadata } from "next";
import { LandingPage } from "@/components/landing/landing-page";

export const metadata: Metadata = {
  title: "XGuard-AI | Next-Gen Threat Detection & Explainable AI Defense",
  description: "XGuard-AI protects your network with state-of-the-art AI, instantly detecting and analyzing malicious traffic before it impacts your systems with real-time SHAP explainability.",
  openGraph: {
    title: "XGuard-AI | Next-Gen Threat Detection & Explainable AI Defense",
    description: "Built an AI intrusion detection system that doesn't just say 'attack.' It tells you WHY. Streaming Kafka, 99.86% accuracy XGBoost, and SHAP explainability.",
    url: "https://xguard-ai.tech",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "XGuard-AI - Next-Gen Threat Detection & Explainable AI Defense",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "XGuard-AI | Next-Gen Threat Detection",
    description: "Built an AI intrusion detection system that doesn't just say 'attack.' It tells you WHY. Streaming Kafka, 99.86% XGBoost, and SHAP explanations.",
    images: ["/og-image.png"],
  },
};

export default function HomePage() {
  return <LandingPage />;
}
