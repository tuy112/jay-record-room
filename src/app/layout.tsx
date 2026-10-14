import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
      title: "Jay's Record Room",
      description: "가계부+운동기록+일기장+개발일지 기록방",
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
