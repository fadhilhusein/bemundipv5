import Link from "next/link";
import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="bg-brown py-8 text-white">
      <Container className="flex flex-col items-center justify-between gap-5 text-center text-sm sm:flex-row sm:text-left">
        <p>© 2026 BEM Universitas Diponegoro.</p>
        <nav className="flex flex-wrap justify-center gap-5 font-medium">
          <Link href="/#beranda" className="hover:text-peach">
            Beranda
          </Link>
          <Link href="/publikasi" className="hover:text-peach">
            Publikasi
          </Link>
          <Link href="/agenda" className="hover:text-peach">
            Agenda
          </Link>
          <Link href="/#ruang-gerak" className="hover:text-peach">
            Ruang Gerak
          </Link>
        </nav>
      </Container>
    </footer>
  );
}
