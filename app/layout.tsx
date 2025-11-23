import type { Metadata } from "next";
import { Inter } from "next/font/google";
// import { Analytics } from "@vercel/analytics/next";

import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TinyLink — URL Shortener",
    template: "%s | TinyLink",
  },
  description:
    "Shorten URLs, track clicks, and manage your links with TinyLink",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          {/* If everything is set up properly, you should be able to see a Fetch/XHR request in your browser's Network tab from /_vercel/insights/view when you visit any page. */}
          {/* <Analytics /> */}
        </ThemeProvider>
      </body>
    </html>
  );
}
