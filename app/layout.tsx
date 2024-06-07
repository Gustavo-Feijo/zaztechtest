import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import TopBar from "@/components/TopBar";
import { cn } from "@/lib/utils";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "ZazTech Crud",
  description: "CRUD de produtos, categorias e fornecedores",
};

// Root layout, utilizando NextThemeProvider para adicionar dark e light mode.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen flex flex-col items-center justify-start",
          inter.className
        )}
      >
        <SpeedInsights />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TopBar />
          <main className="w-full flex-1 flex items-center justify-center">
            {children}
          </main>{" "}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
