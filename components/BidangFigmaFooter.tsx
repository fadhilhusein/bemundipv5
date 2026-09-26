import Image from "next/image";
import Link from "next/link";

const socialLinks = [
  { label: "Instagram.com/bemundip", href: "https://www.instagram.com/bemundip", icon: "/assets/bidang-figma/instagram.png", width: 66, height: 65 },
  { label: "X.com/bemundip", href: "https://x.com/bemundip", icon: "/assets/bidang-figma/x.png", width: 90, height: 76 },
  { label: "Youtube.com/bemundip", href: "https://www.youtube.com/@bemundip", icon: "/assets/bidang-figma/youtube.png", width: 68, height: 72 },
  { label: "Tiktok.com/bemundip", href: "https://www.tiktok.com/@bemundip", icon: "/assets/bidang-figma/tiktok.png", width: 73, height: 73 }
];

export function BidangFigmaFooter() {
  return (
    <footer className="relative overflow-hidden rounded-t-[26px] bg-[#272727] text-[#fcfcfd]">
      <div className="relative mx-auto min-h-[500px] max-w-[1399px] px-7 pb-12 pt-10 sm:px-12 lg:min-h-[560px] lg:px-16">
        <h2 className="relative z-10 text-center font-display text-3xl font-bold sm:text-5xl lg:text-[68px]">Connect With Us!</h2>

        <div className="relative z-10 mt-10 max-w-[760px] border-y border-[#475467] py-5 sm:mt-14 sm:py-6">
          <ul className="space-y-3 sm:space-y-4">
            {socialLinks.map((item) => (
              <li key={item.label}>
                <Link href={item.href} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-4 font-display text-xl transition-colors hover:text-[#ff8d28] sm:text-2xl lg:text-[30px]">
                  <span className="grid h-11 w-11 place-items-center sm:h-12 sm:w-12">
                    <Image src={item.icon} alt="" width={item.width} height={item.height} className="max-h-10 w-auto object-contain sm:max-h-11" />
                  </span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <a href="mailto:bemkm1.undip@gmail.com" className="relative z-10 mt-5 inline-block font-display text-lg uppercase transition-colors hover:text-[#ff8d28] sm:pl-16 sm:text-2xl lg:text-[28px]">
          BEMKM1.UNDIP@GMAIL.COM
        </a>

        <Image src="/assets/bidang-figma/footer-figures.svg" alt="" width={597} height={717} className="pointer-events-none absolute -bottom-14 -right-44 hidden h-[530px] w-auto max-w-none lg:block" />
      </div>
    </footer>
  );
}
