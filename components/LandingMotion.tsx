"use client";

import { MotionConfig, useAnimate, useInView, useReducedMotion } from "motion/react";
import { useEffect } from "react";

export function LandingMotion({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

export function LandingReveal({ children, className = "", delay = 0, immediate = false }: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  immediate?: boolean;
}) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const inView = useInView(scope, { once: true, amount: 0.15 });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      animate(scope.current, { opacity: 1, transform: "none" }, { duration: 0 });
      return;
    }
    if (!inView || immediate) return;
    const controls = animate(scope.current, {
      opacity: [0.8, 1],
      transform: ["translateY(12px)", "translateY(0px)"]
    }, { duration: 0.4, delay: Math.min(Math.max(delay, 0), 150) / 1000, ease: "easeOut" });
    return () => controls.stop();
  }, [animate, delay, immediate, inView, reduceMotion, scope]);

  // SSR stays visible. Enhancement starts only after hydration and viewport entry.
  return <div ref={scope} className={className}>{children}</div>;
}
