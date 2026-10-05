import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analyst Dashboard | XGuard-AI",
  description: "Monitor real-time network traffic, view AI threat predictions, and analyze intrusion attempts in the XGuard-AI dashboard.",
  openGraph: {
    title: "Analyst Dashboard | XGuard-AI",
    description: "Monitor real-time network traffic, view AI threat predictions, and analyze intrusion attempts in the XGuard-AI dashboard.",
    url: "https://xguard-ai.tech/dashboard",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "XGuard-AI Analyst Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Analyst Dashboard | XGuard-AI",
    description: "Live network traffic monitoring, 99.86% XGBoost threat detection, and SHAP explainability.",
    images: ["/og-image.png"],
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
