"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  description: string;
  leftContent: ReactNode;
  closingQuote: string;
};

export function BidangHeroPanel({ description, leftContent, closingQuote }: Props) {
  const upperArea = useRef<HTMLDivElement>(null);
  const measuringText = useRef<HTMLParagraphElement>(null);
  const [splitAt, setSplitAt] = useState(0);

  useLayoutEffect(() => {
    const area = upperArea.current;
    const measure = measuringText.current;
    if (!area || !measure) return;

    // Keep whitespace and paragraph breaks intact when continuing below.
    const boundaries = Array.from(description.matchAll(/\S+\s*/g), (match) =>
      (match.index ?? 0) + match[0].length
    );
    const fitText = () => {
      let low = 0;
      let high = boundaries.length;
      while (low < high) {
        const middle = Math.ceil((low + high) / 2);
        measure.textContent = description.slice(0, boundaries[middle - 1]).trimEnd();
        if (measure.getBoundingClientRect().height <= area.getBoundingClientRect().height) {
          low = middle;
        } else {
          high = middle - 1;
        }
      }
      setSplitAt(low ? boundaries[low - 1] : 0);
    };

    fitText();
    const observer = new ResizeObserver(fitText);
    observer.observe(area);
    document.fonts.addEventListener("loadingdone", fitText);
    return () => {
      observer.disconnect();
      document.fonts.removeEventListener("loadingdone", fitText);
    };
  }, [description]);

  const beginning = description.slice(0, splitAt).trimEnd();
  const continuation = description.slice(splitAt).trimStart();

  return (
    <div className="bidang-poster-panel">
      <p className="sr-only">{description}</p>
      <div className="bidang-poster-copy">
        {leftContent}
        {continuation ? (
          <p aria-hidden="true" className="bidang-description bidang-poster-description whitespace-pre-line">
            {continuation}
          </p>
        ) : null}
      </div>
      <div className="bidang-poster-story">
        <div ref={upperArea} className="bidang-description-upper">
          <p aria-hidden="true" className="bidang-poster-description whitespace-pre-line">{beginning}</p>
          <p ref={measuringText} aria-hidden="true" className="bidang-description-measure bidang-poster-description whitespace-pre-line" />
        </div>
        <p className="bidang-poster-closing whitespace-pre-line">{closingQuote}</p>
      </div>
    </div>
  );
}
