import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jay's Record Room",
  description: "account and exercise record",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
