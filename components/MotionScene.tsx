"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function MotionScene() {
  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    gsap.utils.toArray<HTMLElement>("[data-gsap-image]").forEach((element) => {
      gsap.fromTo(
        element,
        { scale: 0.86, opacity: 0.55 },
        {
          scale: 1,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 88%",
            end: "bottom 35%",
            scrub: 0.8
          }
        }
      );
    });

    gsap.utils.toArray<HTMLElement>("[data-scrub-copy]").forEach((element) => {
      gsap.fromTo(
        element,
        { opacity: 0.35, y: 22 },
        {
          opacity: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            start: "top 82%",
            end: "top 48%",
            scrub: true
          }
        }
      );
    });
  }, []);

  return null;
}
