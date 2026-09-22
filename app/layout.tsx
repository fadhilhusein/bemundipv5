import type { Metadata } from "next";
import {
  ABeeZee,
  Abhaya_Libre,
  Abril_Fatface,
  Alata,
  Great_Vibes,
  Hind_Madurai,
  Playfair_Display,
  Poppins
} from "next/font/google";
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

const abhayaLibre = Abhaya_Libre({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-abhaya",
  display: "swap"
});

const abeezee = ABeeZee({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-abeezee",
  display: "swap"
});

const abrilFatface = Abril_Fatface({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-abril",
  display: "swap"
});

const hindMadurai = Hind_Madurai({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hind",
  display: "swap"
});

const alata = Alata({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-alata",
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
      <body
        className={`${playfair.variable} ${poppins.variable} ${greatVibes.variable} ${abhayaLibre.variable} ${abeezee.variable} ${abrilFatface.variable} ${hindMadurai.variable} ${alata.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
