import type { Metadata } from "next";
import { ThemeProvider } from "@/shared/components/theme-provider";
import { AuthLayer } from "@/shared/components/auth-layer";
import { Toaster } from "@/shared/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "RepoBrain - AI Repository Analysis",
  description: "Engage with an AI-driven chat interface for GitHub repository analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthLayer>{children}</AuthLayer>
          <Toaster richColors closeButton position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
