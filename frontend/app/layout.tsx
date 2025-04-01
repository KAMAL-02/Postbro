import type { Metadata } from "next";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Navbar from "@/components/navbar";
import "./globals.css";

import { Inter, JetBrains_Mono } from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Postbro",
  description: "Postman alternative",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${jetbrainsMono.variable} h-screen flex flex-col`}>
        <Navbar />
        <div className="flex-1 flex overflow-hidden">
          <SidebarProvider>
            <AppSidebar />
            <main className="flex-1">
              {children}
            </main>
          </SidebarProvider>
        </div>
      </body>
    </html>
  );
}
