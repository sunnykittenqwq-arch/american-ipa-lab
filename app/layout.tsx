import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "美音发音室｜美式音标系统学习",
  description:
    "从音标分类出发，点击练习美式英语的单词、词组、句子与连读规则。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
