import type { Metadata } from "next";
import { RootContextProvider } from "@/components/RootContext";
import { Toaster } from "@/components/ui/sonner";
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
    <html lang="en" className="h-full antialiased dark" style={{ colorScheme: "dark" }}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <RootContextProvider>
          {children}
          <Toaster richColors closeButton position="top-right" />
        </RootContextProvider>
      </body>
    </html>
  );
}
