import type { Metadata } from "next";
import { Unbounded, DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Layout/Provider";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart-Office",
  description: "Smart-Office",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${unbounded.variable} ${dmSans.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
