import type { Metadata } from "next";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import "./globals.css";


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
      <body> {/* ✅ Body starts immediately */}
        <SidebarProvider> {/* ✅ Placed inside <body> */}
          <AppSidebar />
          {/* <SidebarTrigger /> */}
          {children}
        </SidebarProvider>
      </body>
    </html>
  );
}
