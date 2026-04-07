import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dr. Alder - Smart Factory Gateway",
  description: "Local Factory Gateway für Dr. Alder's Heimtiernahrung",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={`${inter.className} bg-slate-50 text-slate-900 min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
