import Image from "next/image";
import { Flower2 } from "lucide-react";

export function LandingSectionOrnament({ side = "right" }: { side?: "left" | "right" }) {
  return (
    <div className={`landing-section-ornament landing-section-ornament--${side}`} aria-hidden="true">
      <div className="landing-section-ornament-rail">
        <Image
          src="/assets/landing/hero-botanical-frame.webp"
          alt=""
          fill
          sizes="(min-width: 1440px) 160px, 1px"
          className="landing-section-ornament-image"
          draggable={false}
        />
      </div>
      <div className="landing-section-ornament-divider">
        <span />
        <Flower2 size={18} strokeWidth={1.35} />
        <span />
      </div>
    </div>
  );
}
