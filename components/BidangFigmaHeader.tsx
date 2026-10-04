import Link from "next/link";

const items = [
  { label: "Beranda", href: "/#beranda" },
  { label: "Departemen", href: "/#bidang" },
  { label: "Publikasi", href: "/publikasi" },
  { label: "Agenda", href: "/agenda" },
  { label: "Layanan", href: "/layanan" },
  { label: "Kontak", href: "/#kontak" }
] as const;

type BidangFigmaHeaderProps = {
  active?: (typeof items)[number]["label"];
  /** Background behind the floating nav; match it to the page canvas. */
  className?: string;
};

export function BidangFigmaHeader({ active = "Departemen", className = "bg-[#f5f5f5]" }: BidangFigmaHeaderProps) {
  return (
    <header className={`relative z-50 overflow-x-clip px-3.5 pb-7 pt-7 sm:px-8 sm:pb-10 sm:pt-10 lg:pb-14 lg:pt-14 ${className}`}>
      <nav
        aria-label="Navigasi utama"
        className="bidang-nav-scroll mx-auto flex w-full max-w-[1207px] items-center gap-1 overflow-x-auto rounded-full border border-white bg-[#b84b00] p-2 font-display text-sm text-white shadow-[0_4px_2px_rgba(0,0,0,0.25)] backdrop-blur-md sm:justify-between sm:gap-2 sm:px-4 lg:text-base"
      >
        {items.map((item) => {
          const isActive = item.label === active;
          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`shrink-0 rounded-full px-5 py-3 text-center transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-6 lg:px-9 ${
                isActive ? "border border-[#21005d] bg-[#fd853a]" : "border border-transparent"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
