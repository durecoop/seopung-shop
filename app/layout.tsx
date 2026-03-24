import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "서풍몰 | 프리미엄 수산물 쇼핑",
    template: "%s | 서풍몰",
  },
  description: "영어조합법인 서풍의 공식 온라인 쇼핑몰. HACCP·ASC·MSC 인증 프리미엄 수산물을 만나보세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
