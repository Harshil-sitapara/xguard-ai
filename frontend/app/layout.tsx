import { Suspense } from "react";
import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "XGuard-AI | Next-Gen Threat Detection",
  description: "Advanced AI-powered network intrusion detection system providing real-time threat analysis and protection.",
  keywords: ["IDS", "Intrusion Detection", "AI Security", "Network Security", "Cybersecurity", "XGuard-AI", "Threat Detection"],
  authors: [{ name: "XGuard-AI Team" }],
  creator: "XGuard-AI Team",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://xguard-ai.com",
    title: "XGuard-AI | Next-Gen Threat Detection",
    description: "Advanced AI-powered network intrusion detection system providing real-time threat analysis and protection.",
    siteName: "XGuard-AI",
    images: [
      {
        url: "/brand/log_with_name.png",
        width: 1200,
        height: 630,
        alt: "XGuard-AI Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "XGuard-AI | Next-Gen Threat Detection",
    description: "Advanced AI-powered network intrusion detection system providing real-time threat analysis and protection.",
    images: ["/brand/log_with_name.png"],
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
