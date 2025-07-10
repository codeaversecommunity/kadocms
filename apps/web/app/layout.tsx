import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Toaster } from "sonner";
import { ConfirmDialogProvider } from "@/components/providers/confirm-dialog-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KadoCMS - Headless CMS",
  description:
    "KadoCMS is a headless CMS designed for developers, providing a flexible and powerful content management solution.",
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
        <ConfirmDialogProvider>{children}</ConfirmDialogProvider>

        <Toaster
          position="top-right"
          richColors
          closeButton={false}
          toastOptions={{
            className: "bg-background text-foreground",
            style: {
              fontFamily: "var(--font-geist-sans)",
            },
          }}
        />
      </body>
    </html>
  );
}
