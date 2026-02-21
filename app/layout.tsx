import type { Metadata, Viewport } from "next";
import { Cinzel, Crimson_Text } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const _cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "500", "600", "700"],
});

const _crimsonText = Crimson_Text({
  subsets: ["latin"],
  variable: "--font-crimson",
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Chronicles of the Shattered Realm | Campaign Compendium",
  description:
    "A Dungeons & Dragons campaign tracker for the Chronicles of the Shattered Realm. Explore locations, NPCs, session logs, items, and lore.",
};

export const viewport: Viewport = {
  themeColor: "#1a1612",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${_cinzel.variable} ${_crimsonText.variable} bg-background`}>
      <body className="font-sans antialiased" suppressHydrationWarning>{children}<Analytics /></body>
    </html>
  );
}
