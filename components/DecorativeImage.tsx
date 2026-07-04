import Image from "next/image";
import type { CSSProperties } from "react";

type DecorativeImageProps = {
  src: string;
  alt?: string;
  width: number;
  height: number;
  className?: string;
  rotate?: number;
  priority?: boolean;
  "data-gsap-image"?: boolean;
};

export function DecorativeImage({
  src,
  alt = "",
  width,
  height,
  className = "",
  rotate = 0,
  priority = false,
  "data-gsap-image": dataGsapImage = false
}: DecorativeImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      loading={priority ? undefined : "lazy"}
      data-gsap-image={dataGsapImage ? "" : undefined}
      className={`pointer-events-none select-none object-contain ${className}`}
      style={{ "--rotate": `${rotate}deg` } as CSSProperties}
    />
  );
}
