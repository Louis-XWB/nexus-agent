import type { Metadata } from "next";
import { Sidebar } from "@/components/layout/sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexus - Autonomous On-Chain AI Agent",
  description: "AI-powered intelligence and trading agent on X Layer",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background antialiased">
        <Sidebar />
        <main className="pl-[240px]"><div className="max-w-6xl mx-auto px-8 py-8">{children}</div></main>
      </body>
    </html>
  );
}
