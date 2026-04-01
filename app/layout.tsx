import type { Metadata } from "next";
import "./globals.css";
import PageViewTracker from "@/components/PageViewTracker";

export const metadata: Metadata = {
  title: {
    default: "서풍몰 | 프리미엄 수산물 쇼핑",
    template: "%s | 서풍몰",
  },
  description: "영어조합법인 서풍의 공식 온라인 쇼핑몰. HACCP·ASC·MSC 인증 프리미엄 수산물, 냉동수산물, 건어물, 선물세트를 만나보세요.",
  keywords: "서풍몰, 서풍, 수산물, 쇼핑몰, 영광굴비, 냉동수산물, 건어물, 수산물 선물세트, HACCP, ASC, MSC, 여수 수산물, 프리미엄 수산물, 수산물 쇼핑",
  openGraph: {
    title: "서풍몰 | 프리미엄 수산물 쇼핑",
    description: "HACCP·ASC·MSC 인증 프리미엄 수산물, 냉동수산물, 건어물, 선물세트를 만나보세요.",
    url: "https://shop.seopung.co.kr",
    siteName: "서풍몰",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "https://seopung.co.kr/logo_transparent.png",
        alt: "서풍몰 로고",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "서풍몰 | 프리미엄 수산물 쇼핑",
    description: "HACCP·ASC·MSC 인증 프리미엄 수산물을 만나보세요.",
    images: ["https://seopung.co.kr/logo_transparent.png"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://shop.seopung.co.kr" },
  verification: {
    other: { "naver-site-verification": "b5c66f9cb585b636bf4d5f863d6b754e49ee133d" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "OnlineStore",
              "name": "서풍몰",
              "url": "https://shop.seopung.co.kr",
              "logo": "https://seopung.co.kr/logo_transparent.png",
              "description": "영어조합법인 서풍의 공식 온라인 쇼핑몰. HACCP·ASC·MSC 인증 프리미엄 수산물",
              "parentOrganization": {
                "@type": "Organization",
                "name": "영어조합법인 서풍",
                "url": "https://seopung.co.kr"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://shop.seopung.co.kr/products?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col"><PageViewTracker site="shop" />{children}</body>
    </html>
  );
}
