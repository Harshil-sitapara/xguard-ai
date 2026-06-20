import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | XGuard-AI",
  description: "Monitor real-time network traffic, view AI threat predictions, and analyze intrusion attempts in the XGuard-AI dashboard.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
