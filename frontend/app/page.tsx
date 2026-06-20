import { Metadata } from "next";
import { LandingPage } from "@/components/landing/landing-page";

export const metadata: Metadata = {
  title: "XGuard-AI | Next-Gen Threat Detection",
  description: "XGuard-AI protects your network with state-of-the-art AI, instantly detecting and analyzing malicious traffic before it impacts your systems.",
};

export default function HomePage() {
  return <LandingPage />;
}
