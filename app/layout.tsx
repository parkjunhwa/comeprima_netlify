import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "comeprima - Design Agency",
  description: "우리는 당신의 아이디어를 현실로 만듭니다. 디자인과 창의성으로 브랜드를 만들어갑니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-black text-white">
        {children}
      </body>
    </html>
  );
}
