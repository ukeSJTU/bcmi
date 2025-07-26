import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader, SiteFooter } from "@/components/layout";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BCMI - Brain-like Computing & Machine Intelligence",
  description: "Center for Brain-like Computing and Machine Intelligence at Shanghai Jiao Tong University. Research in brain-computer interfaces, machine learning, computer vision, and cognitive computing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <div className="flex-1">
            {children}
          </div>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
