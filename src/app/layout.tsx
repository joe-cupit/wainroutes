import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/app/components/Navbar/Navbar";
import Footer from "@/app/components/Footer/Footer";


export const metadata: Metadata = {
  title: "Wainroutes",
  description: "Wainroutes Lake District Walks",
};

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
      </body>
    </html>
  );
}
