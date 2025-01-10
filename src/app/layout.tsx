import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SidebarProvider from "@/providers/SidebarProvider";
import ThemeProvider from "@/providers/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Limpopo Chefs | Portal | Home",
  description: "Limpopo Chefs Student Portal Home",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <title>Limpopo Chefs | Portal | Home</title>
      </head>
      <body className={inter.className}>
        <SidebarProvider>
          <ThemeProvider>
            <AuthProvider>{children}</AuthProvider>
          </ThemeProvider>
        </SidebarProvider>
      </body>
    </html>
  );
}
