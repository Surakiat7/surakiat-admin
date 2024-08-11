import "./globals.css";
import { Metadata } from "next";
import { ConfigProvider } from "antd";
import { antdtheme } from "@/styles/antdtheme";
import { AuthProvider } from "@/contexts/authContext";
import { NavbarProvider } from "@/contexts/navbarContext";
import { notoSansThai } from "./fonts";

export const metadata: Metadata = {
  title: "Surakiat Admin",
  description: "Echo Karaoke Admin จัดการลิสต์เพลงทั้งหมดของ Echo Karaoke",
  openGraph: {
    images: [
      {
        url: "https://echo-karaoke-admin.vercel.app/img/Echokaraoke-admin-openGraph.png",
        width: 1200,
        height: 630,
        alt: "Echo Karaoke admin",
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
      <body className="min-h-screen p-0 m-0">
        <ConfigProvider theme={antdtheme}>
          <AuthProvider>
            <NavbarProvider>{children}</NavbarProvider>
          </AuthProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
