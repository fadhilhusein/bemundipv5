import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type StatePanelProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action: { href: string; label: string };
};

/** Empty, no-result, and error state used on the public listing pages. */
export function StatePanel({ icon: Icon, title, description, action }: StatePanelProps) {
  return (
    <div className="mt-8 rounded-[28px] bg-surface px-6 py-14 text-center sm:px-10 lg:rounded-[40px]">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white text-accent-deep shadow-float">
        <Icon size={28} aria-hidden="true" />
      </span>
      <h3 className="landing-title mx-auto mt-6 max-w-xl break-words text-3xl leading-tight text-charcoal [overflow-wrap:anywhere] sm:text-4xl">
        {title}
      </h3>
      <p className="landing-copy mx-auto mt-3 max-w-md font-landing-copy text-base leading-relaxed text-ink/70">{description}</p>
      <Link
        href={action.href}
        className="mt-7 inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-6 font-sans text-sm font-bold text-white transition hover:bg-charcoal active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
      >
        {action.label}
      </Link>
    </div>
  );
}
