import type { Metadata } from "next";

import "./globals.css";
import { Inter } from "next/font/google";
import { Provider } from "@/app/providers/Provider";
import { Header } from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SBTZ",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Provider>
        <body className={inter.className}>
          {/* <Header /> */}
          {children}
          {/* <Footer /> */}
        </body>
      </Provider>
    </html>
  );
}
