import type { Metadata } from "next";
import "./globals.css";
import PageViewTracker from "@/components/PageViewTracker";

export const metadata: Metadata = {
  title: {
    default: "서풍몰 | 프리미엄 수산물 쇼핑",
    template: "%s | 서풍몰",
  },
  description: "영어조합법인 서풍의 공식 온라인 쇼핑몰. HACCP·ASC·MSC 인증 프리미엄 수산물을 만나보세요.",
  keywords: "서풍몰, 수산물, 쇼핑몰, 영광굴비, 냉동수산물, HACCP, ASC, MSC, 선물세트",
  openGraph: {
    title: "서풍몰 | 프리미엄 수산물 쇼핑",
    description: "HACCP·ASC·MSC 인증 프리미엄 수산물을 만나보세요.",
    url: "https://shop.seopung.co.kr",
    siteName: "서풍몰",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "서풍몰 | 프리미엄 수산물 쇼핑",
    description: "HACCP·ASC·MSC 인증 프리미엄 수산물을 만나보세요.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://shop.seopung.co.kr" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col"><PageViewTracker site="shop" />{children}</body>
    </html>
  );
}
