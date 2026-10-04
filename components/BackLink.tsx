import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type BackLinkProps = {
  href: string;
  children: React.ReactNode;
};

/** Pill-shaped "back to list" link used at the top of detail pages, styled like the bidang page's back link. */
export function BackLink({ href, children }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-orange-ink/25 bg-white px-4 text-sm font-semibold text-orange-ink transition hover:bg-orange-ink hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-ink"
    >
      <ArrowLeft size={16} aria-hidden="true" className="transition group-hover:-translate-x-0.5" />
      {children}
    </Link>
  );
}
