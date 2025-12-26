import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Job Application Tracker",
  description: "Track your job applications with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-50`}
      >
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-neutral-200 bg-white">
            <nav className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">Job Tracker</h1>
                <div className="flex gap-6">
                  <Link
                    href="/"
                    className="text-sm font-medium hover:text-blue-600 transition-colors"
                  >
                    Board
                  </Link>
                  <Link
                    href="/follow-up"
                    className="text-sm font-medium hover:text-blue-600 transition-colors"
                  >
                    Follow-up
                  </Link>
                  <Link
                    href="/offers"
                    className="text-sm font-medium hover:text-blue-600 transition-colors"
                  >
                    Offers
                  </Link>
                </div>
              </div>
            </nav>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
