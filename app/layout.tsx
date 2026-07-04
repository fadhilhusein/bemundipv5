import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BEM Universitas Diponegoro 2026",
  description: "Website organisasi Kabinet BEM Universitas Diponegoro 2026."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
