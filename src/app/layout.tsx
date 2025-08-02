import "./globals.css";

import type { Metadata } from "next";


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
        {children}
      </body>
    </html>
  );
}
