import Image from "next/image";
import Link from "next/link";

const socialLinks = [
  {
    label: "Instagram",
    handle: "instagram.com/bemundip",
    href: "https://www.instagram.com/bemundip",
    icon: "/assets/landing/instagram.png"
  },
  {
    label: "X",
    handle: "x.com/bemundip",
    href: "https://x.com/bemundip",
    icon: "/assets/landing/x.png"
  },
  {
    label: "YouTube",
    handle: "youtube.com/@bemundip",
    href: "https://www.youtube.com/@bemundip",
    icon: "/assets/landing/youtube.png"
  },
  {
    label: "TikTok",
    handle: "tiktok.com/@bemundip",
    href: "https://www.tiktok.com/@bemundip",
    icon: "/assets/landing/tiktok.png"
  }
];

export function Footer() {
  return (
    <footer id="kontak" className="rounded-t-[24px] bg-[#272727] px-5 pb-7 pt-11 text-white sm:rounded-t-[32px] sm:px-8 sm:pb-8 sm:pt-14">
      <div className="mx-auto max-w-[1180px]">
        <h2 className="landing-title font-landing-display text-[clamp(2.35rem,5vw,3.5rem)] leading-none text-[#FCFCFD]">
          Connect With Us
        </h2>
        <div className="mt-6 border-t border-white/20">
          {socialLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Buka ${item.label} BEM UNDIP`}
              className="group flex items-center gap-3 border-b border-white/15 py-2.5 transition hover:bg-white/[0.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:gap-5 sm:py-3"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center sm:h-11 sm:w-11">
                <Image src={item.icon} alt="" width={64} height={64} className="max-h-full max-w-full object-contain" />
              </span>
              <span className="min-w-0 flex-1 break-all text-base sm:text-xl">{item.handle}</span>
              <span className="text-sm text-white/45 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white">
                ↗
              </span>
            </a>
          ))}
          <a
            href="mailto:bemkm1.undip@gmail.com"
            className="group flex items-center gap-3 border-b border-white/15 py-2.5 transition hover:bg-white/[0.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:gap-5 sm:py-3"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/25 font-sans text-[10px] font-bold sm:h-11 sm:w-11 sm:text-xs">
              @
            </span>
            <span className="min-w-0 flex-1 break-all text-base uppercase sm:text-xl">bemkm1.undip@gmail.com</span>
            <span className="text-sm text-white/45 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white">
              ↗
            </span>
          </a>
        </div>

        <div className="mt-6 flex flex-col gap-4 border-t border-white/20 pt-5 font-sans text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 BEM Universitas Diponegoro.</p>
          <nav className="flex flex-wrap gap-x-5 gap-y-3" aria-label="Navigasi footer">
            <Link href="/#beranda" className="transition hover:text-white">Beranda</Link>
            <Link href="/#bidang" className="transition hover:text-white">Departemen</Link>
            <Link href="/publikasi" className="transition hover:text-white">Publikasi</Link>
            <Link href="/agenda" className="transition hover:text-white">Agenda</Link>
            <Link href="/login" className="transition hover:text-white">Login</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
