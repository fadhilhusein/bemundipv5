"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { X, ZoomIn, ImageOff } from "lucide-react";

type ImageLightboxProps = {
  src: string;
  alt: string;
  wrapperClassName?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  roundedClass?: string;
};

export function ImageLightbox({
  src,
  alt,
  wrapperClassName = "relative aspect-video w-full overflow-hidden rounded-sm border border-clay/40 bg-cream",
  imageClassName = "object-contain p-1",
  sizes = "(max-width: 768px) 100vw, 400px",
  priority = false,
  quality = 75,
  roundedClass = "rounded-sm",
}: ImageLightboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [mounted, setMounted] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const prevActiveRef = useRef<HTMLElement | null>(null);

  useEffect(() => setMounted(true), []);

  // Reset error when src changes (e.g. optimistic update)
  useEffect(() => setHasError(false), [src]);

  const close = useCallback(() => setIsOpen(false), []);

  // Focus management: move focus to close button on open, restore on close
  useEffect(() => {
    if (!isOpen) return;
    prevActiveRef.current = document.activeElement as HTMLElement | null;
    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 0);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      prevActiveRef.current?.focus?.();
    };
  }, [isOpen]);

  // Keyboard: Escape + Tab trap (close button ↔ backdrop)
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
      if (e.key === "Tab") {
        // Single focusable element (close button) — keep focus trapped
        const focusable = [closeBtnRef.current].filter(Boolean) as HTMLElement[];
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, close]);

  // Guard: alt may be extremely long / contain emoji / RTL — provide safe truncated label for aria
  const safeAlt = alt.trim() || "gambar tanpa judul";
  const ariaOpenLabel = `Lihat gambar ${safeAlt.slice(0, 80)} ukuran penuh`;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={ariaOpenLabel}
        title={safeAlt}
        className={`group/image relative block min-w-0 cursor-zoom-in text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown ${wrapperClassName}`}
      >
        {hasError ? (
          <span className="flex h-full min-h-[140px] w-full flex-col items-center justify-center gap-2 bg-cream px-4 py-6 text-center">
            <ImageOff className="h-8 w-8 text-clay/60" aria-hidden="true" />
            <span className="max-w-full break-words text-xs font-semibold leading-snug text-clay">
              Gambar tidak dapat dimuat
            </span>
            <span className="max-w-full break-all text-[10px] leading-snug text-clay/60 [overflow-wrap:anywhere]">
              {src.slice(0, 48)}
            </span>
          </span>
        ) : (
          <Image
            src={src}
            alt={safeAlt}
            fill
            sizes={sizes}
            priority={priority}
            quality={quality}
            decoding="async"
            onError={() => setHasError(true)}
            className={`${imageClassName} [overflow-wrap:anywhere] transition-transform duration-300 group-hover/image:scale-[1.02]`}
          />
        )}
        {!hasError && (
          <>
            {/* subtle scrim on hover */}
            <span className="pointer-events-none absolute inset-0 bg-brown/0 transition duration-200 group-hover/image:bg-brown/[0.04] group-focus-visible/image:bg-brown/[0.04]" />
            {/* desktop: corner badge — mobile: same badge, still legible without covering center */}
            <span className="pointer-events-none absolute bottom-2.5 right-2.5 flex items-center gap-1.5 rounded-full bg-brown px-2.5 py-1.5 text-xs font-bold leading-none text-white opacity-0 shadow-md transition duration-200 group-hover/image:opacity-100 group-focus-visible/image:opacity-100">
              <ZoomIn size={13} aria-hidden="true" className="shrink-0" />
              <span className="hidden sm:inline">Perbesar</span>
              <span className="sm:hidden">Lihat</span>
            </span>
          </>
        )}
      </button>

      {isOpen && mounted
        ? createPortal(
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1a0f0a]/80 p-4 backdrop-blur-md sm:p-6"
              role="dialog"
              aria-modal="true"
              aria-label={`Pratinjau gambar ${safeAlt.slice(0, 80)}`}
              onClick={close}
            >
              <div
                className="relative flex max-h-[88vh] w-full max-w-[min(92vw,980px)] flex-col items-center"
                onClick={(e) => e.stopPropagation()}
              >
                {hasError ? (
                  <div
                    className={`flex max-h-[70vh] w-full max-w-[560px] flex-col items-center justify-center gap-3 bg-cream px-8 py-12 text-center shadow-2xl ${roundedClass}`}
                  >
                    <ImageOff className="h-10 w-10 text-clay/60" aria-hidden="true" />
                    <p className="max-w-full break-words text-sm font-semibold leading-relaxed text-brown [overflow-wrap:anywhere]">
                      Gambar tidak dapat dimuat
                    </p>
                    <p className="max-w-full break-all text-xs leading-relaxed text-clay [overflow-wrap:anywhere]">
                      {safeAlt}
                    </p>
                    <button
                      type="button"
                      onClick={close}
                      className="mt-2 rounded-full bg-brown px-5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-clay focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown"
                    >
                      Tutup
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="relative flex max-h-[74vh] w-auto max-w-full items-center justify-center overflow-visible">
                      <div
                        className={`relative overflow-hidden bg-[#0e0a07] shadow-[0_24px_64px_rgba(0,0,0,0.55)] ring-1 ring-white/10 ${roundedClass}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={src}
                          alt={safeAlt}
                          onError={() => setHasError(true)}
                          className="block max-h-[74vh] max-w-[88vw] object-contain sm:max-w-[84vw] lg:max-w-[860px]"
                          style={{ height: "auto", width: "auto" }}
                        />
                      </div>
                      <button
                        ref={closeBtnRef}
                        type="button"
                        onClick={close}
                        aria-label="Tutup pratinjau gambar"
                        className="absolute -right-2 -top-2 grid h-9 w-9 place-items-center rounded-full bg-white text-brown shadow-lg ring-1 ring-black/5 transition hover:bg-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:-right-3 sm:-top-3 sm:h-10 sm:w-10"
                      >
                        <X size={16} strokeWidth={2.5} />
                      </button>
                    </div>

                    <div className="mt-4 flex max-w-[min(88vw,640px)] flex-col items-center gap-2">
                      <p className="break-words rounded-full bg-white px-4 py-2 text-center text-xs font-semibold leading-snug text-brown shadow-lg [overflow-wrap:anywhere] sm:text-sm">
                        {safeAlt.length > 120 ? `${safeAlt.slice(0, 120)}…` : safeAlt}
                      </p>
                      <p className="hidden text-center text-xs font-medium tracking-wide text-white/60 sm:block">
                        Tekan Esc atau klik di luar gambar untuk menutup
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
