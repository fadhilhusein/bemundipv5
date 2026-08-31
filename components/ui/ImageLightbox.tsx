"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { X, ZoomIn } from "lucide-react";

type ImageLightboxProps = {
  src: string;
  alt: string;
  wrapperClassName?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  roundedClass?: string;
};

export function ImageLightbox({
  src,
  alt,
  wrapperClassName = "relative aspect-video w-full overflow-hidden rounded-sm border border-clay/40 bg-cream",
  imageClassName = "object-contain p-1",
  sizes = "(max-width: 768px) 100vw, 400px",
  priority = false,
  roundedClass = "rounded-sm",
}: ImageLightboxProps) {
  const [isOpen, setIsOpen] = useState(false);

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, close]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={`Lihat gambar ${alt} ukuran penuh`}
        className={`group/image relative block cursor-zoom-in text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown ${wrapperClassName}`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={`${imageClassName} transition-transform duration-300 group-hover/image:scale-[1.02]`}
        />
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition duration-200 group-hover/image:bg-black/10 group-hover/image:opacity-100 group-focus-visible/image:bg-black/10 group-focus-visible/image:opacity-100">
          <span className="flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-brown shadow-md">
            <ZoomIn size={14} aria-hidden="true" />
            Klik untuk perbesar
          </span>
        </span>
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`Pratinjau gambar ${alt}`}
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Tutup pratinjau gambar"
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white hover:text-brown focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:right-6 md:top-6"
          >
            <X size={20} strokeWidth={2.5} />
          </button>

          <div
            className="relative flex max-h-[90vh] max-w-[92vw] items-center justify-center lg:max-w-[88vw]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              className={`max-h-[90vh] max-w-[92vw] object-contain shadow-2xl ${roundedClass} bg-white lg:max-w-[88vw]`}
              style={{ height: "auto", width: "auto" }}
            />
          </div>

          <p className="pointer-events-none absolute bottom-4 left-1/2 max-w-[90vw] -translate-x-1/2 truncate rounded-full bg-white/90 px-4 py-1.5 text-center text-xs font-semibold text-brown shadow md:bottom-6">
            {alt}
          </p>
        </div>
      ) : null}
    </>
  );
}
