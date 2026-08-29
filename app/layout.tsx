import type { Metadata } from "next";
import { Great_Vibes, Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-playfair",
  display: "swap"
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap"
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-great-vibes",
  display: "swap"
});

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
      <body className={`${playfair.variable} ${poppins.variable} ${greatVibes.variable}`}>{children}</body>
    </html>
  );
}
