import Image from "next/image";
import { HandHeart } from "lucide-react";

type IconTileProps = {
  /** Uploaded icon URL; a default icon is shown when empty. */
  src: string | null;
  className?: string;
};

/**
 * Yellow tile with an icon in the middle, matching the "Layanan kami" cards on the landing page.
 * Used where the Figma layout expects a photo but the content (layanan) only has a small icon.
 */
export function IconTile({ src, className = "" }: IconTileProps) {
  return (
    <div className={`relative grid h-full w-full place-items-center overflow-hidden bg-[#FFF3A8] ${className}`} aria-hidden="true">
      <span className="absolute -right-[10%] -top-[14%] aspect-square w-[42%] rounded-full bg-accent/70" />
      <span className="absolute -bottom-[18%] -left-[10%] aspect-square w-[48%] rounded-full bg-white/70" />
      {src ? (
        <span className="relative block aspect-square w-[32%] max-w-[160px]">
          <Image src={src} alt="" fill sizes="160px" className="object-contain" />
        </span>
      ) : (
        <HandHeart className="relative h-auto w-[32%] max-w-[140px] text-ink" strokeWidth={1.25} />
      )}
    </div>
  );
}
