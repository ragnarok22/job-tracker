import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-50 dark:bg-neutral-950`}
      >
        <ThemeProvider defaultTheme="system" storageKey="job-tracker-theme">
          <div className="min-h-screen flex flex-col">
            <header className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <nav className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-xl font-bold">Job Tracker</h1>
                  <div className="flex items-center gap-6">
                    <Link
                      href="/"
                      className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      Board
                    </Link>
                    <Link
                      href="/follow-up"
                      className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      Follow-up
                    </Link>
                    <Link
                      href="/offers"
                      className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      Offers
                    </Link>
                    <ThemeToggle />
                  </div>
                </div>
              </nav>
            </header>
            <main className="flex-1">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
