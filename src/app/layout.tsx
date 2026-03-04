import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ProtAI-Detect | Deep Learning Protein Abundance Prediction",
  description: "Advanced AI-powered analysis of mass spectrometry data with transformer-based models for protein abundance prediction. Interpretable attention mechanisms for biomarker discovery.",
  keywords: ["Protein Analysis", "Deep Learning", "Transformer", "Mass Spectrometry", "Biomarker Discovery", "AI", "Machine Learning", "Proteomics"],
  authors: [{ name: "Ansh Sharma" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "ProtAI-Detect - Deep Learning Protein Analysis",
    description: "AI-powered protein abundance prediction with interpretable transformer models",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProtAI-Detect",
    description: "Deep Learning System for Protein Abundance Prediction",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-white min-h-screen`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
