import Image from "next/image";

type PageHeroProps = {
  /** Decorative script word shown next to the wordmark, e.g. "News". */
  script: string;
  /** Accessible page title read by screen readers in place of the script word. */
  title: string;
  children?: React.ReactNode;
};

export function PageHero({ script, title, children }: PageHeroProps) {
  return (
    <section className="landing-container" aria-labelledby="page-title">
      <Image
        src="/assets/landing/diponegoro-wordmark.svg"
        alt=""
        width={1311}
        height={154}
        priority
        sizes="(max-width: 1220px) calc(100vw - 40px), 1180px"
        className="h-auto w-full"
      />
      <div className="mt-4 flex flex-col gap-2 sm:mt-6 md:flex-row md:items-center md:gap-10">
        <h1
          id="page-title"
          className="self-end font-script text-[clamp(4.5rem,11vw,8.75rem)] leading-[0.9] text-charcoal md:order-last md:ml-auto md:shrink-0 md:self-center"
        >
          <span aria-hidden="true">{script}</span>
          <span className="sr-only">{title}</span>
        </h1>
        {children ? <div className="min-w-0 flex-1">{children}</div> : null}
      </div>
    </section>
  );
}
