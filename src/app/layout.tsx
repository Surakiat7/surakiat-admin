import "./globals.css";
import { Metadata } from "next";
import { ConfigProvider } from "antd";
import { antdtheme } from "@/styles/antdtheme";
import { AuthProvider } from "@/contexts/authContext";
import { NavbarProvider } from "@/contexts/navbarContext";
import { notoSansThai } from "./fonts";

export const metadata: Metadata = {
  title: "Surakiat Adminator",
  description: "Surakiat Adminator Management System",
  openGraph: {
    images: [
      {
        url: "https://.vercel.app/Logo-openGraph.webp",
        width: 1200,
        height: 630,
        alt: "Surakiat Adminator OpenGraph",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={`${notoSansThai.className}`}>
      <link rel="icon" href="/favicon.ico" />
      <body className="min-h-screen p-0 bg-[#010b19] m-0">
        <ConfigProvider theme={antdtheme}>
          <AuthProvider>
            <NavbarProvider>{children}</NavbarProvider>
          </AuthProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
