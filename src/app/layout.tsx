import "./globals.css";

import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";

import Navbar from "@/app/components/Navbar/Navbar";
import Footer from "@/app/components/Footer/Footer";


export const metadata : Metadata = {
  title: {
    default: "Wainroutes Lake District Walks",
    template: "%s | Wainroutes",
  },
  description: "Walk the Wainwrights in the Lake District with detailed routes, mountain forecasts, and travel info.",
};

export const viewport : Viewport = {
  themeColor: "#0d0d0c"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
