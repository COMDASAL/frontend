// src/app/layout.tsx
import type { Metadata } from "next";
import "../styles/globals.scss";

export const metadata: Metadata = {
  title: "서울교통공사 AI 분석 대시보드",
  description: "내부데이터와 공공데이터 기반 AI 예측 및 시각화 시스템",
};

export default function RootLayout({
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
