import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";

type ActionLinkProps = {
  href: string;
  /** Opens in a new tab with an external-link icon. */
  external?: boolean;
  variant?: "primary" | "secondary";
  children: React.ReactNode;
};

const variants = {
  // accent-deep keeps white text at ~5.5:1 contrast (the lighter accent orange is only ~2.4:1).
  primary: "bg-accent-deep text-white hover:bg-orange-ink",
  secondary: "border border-line bg-white text-charcoal hover:border-ink"
};

/** Pill call-to-action used on detail pages (register, open service, documentation). */
export function ActionLink({ href, external = false, variant = "primary", children }: ActionLinkProps) {
  const className = `inline-flex min-h-12 items-center gap-2 rounded-full px-7 font-sans text-sm font-bold transition active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink ${variants[variant]}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
        <ExternalLink size={16} aria-hidden="true" />
        <span className="sr-only"> (buka di tab baru)</span>
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
      <ArrowUpRight size={16} aria-hidden="true" />
    </Link>
  );
}
