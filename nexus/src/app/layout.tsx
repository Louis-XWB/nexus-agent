import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexus - Autonomous On-Chain AI Agent",
  description: "AI-powered intelligence and trading agent on X Layer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background antialiased">
        {children}
      </body>
    </html>
  );
}
