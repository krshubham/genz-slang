import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/react"
import Script from "next/script";
import { PWAInstallToast } from "@/components/PWAInstallToast";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "GenZ Slang Dictionary",
  description: "Your go-to slang dictionary for the GenZ generation!",
  manifest: "/manifest.json",
  icons: {
    apple: "/apple-touch-icon.png",
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" }
    ]
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GenZ Dict"
  },
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
        <Analytics/>
        <Suspense fallback={null}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
          {children}
          <PWAInstallToast />
        </Suspense>
      </body>
      <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8413536206698191"></Script>
    </html>
  );
}
