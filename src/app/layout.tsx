import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Suyash's Portfolio",
  description:
    "Portfolio of Suyash Agrawal — AI/ML Engineer building production LLM systems, voice AI agents and multi-tenant SaaS.",
  keywords: [
    "AI/ML Engineer",
    "LLM",
    "AI Agents",
    "Voice AI",
    "RAG",
    "Next.js",
    "PostgreSQL",
    "Portfolio",
    "Suyash Agrawal",
  ],
  openGraph: {
    title: "Suyash's Portfolio",
    description:
      "Building production-grade LLM systems, voice AI agents and multi-tenant SaaS.",
    url: "https://portfolio.suyash.ai",
    siteName: "Suyash Agrawal Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Suyash's Portfolio",
    description: "Building production-grade LLM systems, voice AI agents and multi-tenant SaaS.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="default" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
      >
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
