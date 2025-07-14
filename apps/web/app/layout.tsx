import { Toaster } from "sonner";
import { ConfirmDialogProvider } from "@/components/providers/confirm-dialog-provider";
import NextTopLoader from "nextjs-toploader";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { cookies } from "next/headers";
import { fontVariables } from "@/lib/font";
import { cn } from "@/lib/utils";
import ThemeProvider from "@/components/providers/theme-provider";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./theme.css";

const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
};

export const viewport: Viewport = {
  themeColor: META_THEME_COLORS.light,
};

export const metadata: Metadata = {
  title: "KadoCMS - Headless CMS",
  description:
    "KadoCMS is a headless CMS designed for developers, providing a flexible and powerful content management solution.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const activeThemeValue = cookieStore.get("active_theme")?.value;
  const isScaled = activeThemeValue?.endsWith("-scaled");

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body
        className={cn(
          "bg-background overflow-hidden overscroll-none font-sans antialiased",
          activeThemeValue ? `theme-${activeThemeValue}` : "",
          isScaled ? "theme-scaled" : "",
          fontVariables
        )}
      >
        <NextTopLoader showSpinner={false} />
        <NuqsAdapter>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            enableColorScheme
            initialTheme={activeThemeValue || "default"}
          >
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

            <ConfirmDialogProvider>{children}</ConfirmDialogProvider>
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
