import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { AppAnalytics } from "@/components/analytics/app-analytics";
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#030712" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://xguard-ai.tech"),
  title: "XGuard-AI | Next-Gen Threat Detection & Explainable AI Defense",
  description: "Advanced AI-powered network intrusion detection system with streaming Kafka ingestion, 99.86% XGBoost accuracy, and real-time SHAP explainability for every alert.",
  keywords: ["IDS", "Intrusion Detection", "AI Security", "Network Security", "Cybersecurity", "XGuard-AI", "Threat Detection", "SHAP", "XGBoost", "FastAPI", "Kafka"],
  authors: [{ name: "Harshil Sitapara", url: "https://xguard-ai.tech" }],
  creator: "Harshil Sitapara",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://xguard-ai.tech",
    title: "XGuard-AI | Next-Gen Threat Detection & Explainable AI Defense",
    description: "Built an AI intrusion detection system that doesn't just say 'attack.' It tells you WHY. Streaming Kafka, 99.86% accuracy XGBoost, and SHAP explainability.",
    siteName: "XGuard-AI",
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
    creator: "@HarshilSitapara",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", geist.variable)}
    >
      <body suppressHydrationWarning>
        <ThemeProvider>
          <Suspense fallback={null}>
            <AppAnalytics />
          </Suspense>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
