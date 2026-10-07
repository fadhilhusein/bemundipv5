import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin, Newspaper } from "lucide-react";
import { IconTile } from "@/components/IconTile";
import { Reveal } from "@/components/Reveal";

// One block follows the Figma composition: a wide feature card, then a tall photo card
// next to up to three zig-zag rows.
const BLOCK_SIZE = 5;

export type FeedKind = "news" | "agenda" | "service";

export type FeedItem = {
  id: number;
  /** Where the card leads; null renders a card that is not clickable. */
  href: string | null;
  /** Opens `href` in a new tab, for links outside this site. */
  external?: boolean;
  title: string;
  excerpt: string;
  /** Photo for news/agenda, icon for services. */
  image: string | null;
  /** Pill text, e.g. the news category or the organising bidang. */
  tag: string;
  /** Secondary text next to the pill, e.g. a formatted date or the agenda timeline. */
  meta?: string;
  /** Machine-readable date for `meta`; omit when `meta` is not a date. */
  metaDateTime?: string;
  /** Optional coloured pill shown before the tag, e.g. an agenda status. */
  status?: { label: string; className: string };
  location?: string | null;
  /** Dims the image, e.g. for finished or cancelled agendas. */
  muted?: boolean;
};

type FeedOptions = {
  kind: FeedKind;
  readMoreLabel: string;
  /** Shown instead of `readMoreLabel` on cards without a link. */
  unavailableLabel: string;
};

type CardProps = FeedOptions & {
  item: FeedItem;
  reverse?: boolean;
  priority?: boolean;
};

/** Card media: photo, coloured placeholder, or icon tile depending on the content kind. */
export function FeedImage({
  item,
  sizes,
  kind,
  priority = false
}: {
  item: FeedItem;
  sizes: string;
  kind: FeedKind;
  priority?: boolean;
}) {
  if (kind === "service") return <IconTile src={item.image} />;

  if (!item.image) {
    const Icon = kind === "agenda" ? CalendarDays : Newspaper;
    return (
      <div className="grid h-full w-full place-items-center bg-gradient-to-br from-accent to-accent-deep" aria-hidden="true">
        <Icon className="text-white/70" size={44} strokeWidth={1.4} />
      </div>
    );
  }

  return (
    <Image
      src={item.image}
      alt=""
      fill
      sizes={sizes}
      priority={priority}
      className={`object-cover transition duration-500 group-hover:scale-[1.03] ${item.muted ? "opacity-80 grayscale" : ""}`}
    />
  );
}

function CardMeta({ item, onImage = false }: { item: FeedItem; onImage?: boolean }) {
  const metaClass = onImage ? "text-white/80" : "text-ink/65";
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-sans text-xs sm:text-sm">
      {item.status ? (
        <span className={`rounded-full px-3 py-1 font-semibold ${item.status.className}`}>{item.status.label}</span>
      ) : null}
      <span className={`max-w-full truncate rounded-full px-3 py-1 font-semibold text-charcoal ${onImage ? "bg-white/90" : "bg-white"}`}>
        {item.tag}
      </span>
      {item.meta ? (
        item.metaDateTime ? (
          <time dateTime={item.metaDateTime} className={metaClass}>
            {item.meta}
          </time>
        ) : (
          <span className={metaClass}>{item.meta}</span>
        )
      ) : null}
    </div>
  );
}

function CardLocation({ item, onImage = false }: { item: FeedItem; onImage?: boolean }) {
  if (!item.location) return null;
  return (
    <p className={`mt-3 flex min-w-0 items-center gap-1.5 font-sans text-xs sm:text-sm ${onImage ? "text-white/80" : "text-ink/65"}`}>
      <MapPin size={15} aria-hidden="true" className="shrink-0" />
      <span className="truncate">{item.location}</span>
    </p>
  );
}

const stretchedLink = "after:absolute after:inset-0 after:z-10 after:rounded-[inherit] after:content-[''] focus-visible:outline-none";

/** Title link whose hit area stretches over the whole card. */
function CardLink({ item }: { item: FeedItem }) {
  if (!item.href) return <>{item.title}</>;
  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className={stretchedLink}>
        {item.title}
        <span className="sr-only"> (buka di tab baru)</span>
      </a>
    );
  }
  return (
    <Link href={item.href} className={stretchedLink}>
      {item.title}
    </Link>
  );
}

function ReadMore({ item, readMoreLabel, unavailableLabel }: { item: FeedItem } & Pick<FeedOptions, "readMoreLabel" | "unavailableLabel">) {
  if (!item.href) {
    return <span className="mt-5 inline-flex font-sans text-sm font-semibold text-ink/50">{unavailableLabel}</span>;
  }
  return (
    <span className="mt-5 inline-flex items-center gap-1.5 font-sans text-sm font-bold text-accent-deep">
      {readMoreLabel}
      <ArrowUpRight size={18} aria-hidden="true" className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </span>
  );
}

const cardInteraction =
  "group relative transition duration-300 focus-within:outline focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-ink";
const cardHover = "hover:-translate-y-1 hover:shadow-float";

function WideCard({ item, reverse = false, priority = false, kind, readMoreLabel, unavailableLabel }: CardProps) {
  return (
    <article
      className={`${cardInteraction} ${item.href ? cardHover : ""} grid gap-5 rounded-[28px] bg-surface p-3 sm:p-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-center md:gap-8 lg:rounded-[40px]`}
    >
      <div className={`relative aspect-[16/10] overflow-hidden rounded-[22px] lg:rounded-[32px] ${reverse ? "" : "md:order-2"}`}>
        <FeedImage item={item} kind={kind} priority={priority} sizes="(max-width: 767px) calc(100vw - 64px), 520px" />
      </div>
      <div className="min-w-0 px-2 pb-3 sm:px-3 md:py-6 md:pl-5 lg:pl-8">
        <CardMeta item={item} />
        <h3 className="landing-title mt-4 line-clamp-3 break-words text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.02] text-charcoal [overflow-wrap:anywhere]">
          <CardLink item={item} />
        </h3>
        {item.excerpt ? (
          <p className="landing-copy mt-4 line-clamp-4 font-landing-copy text-base leading-relaxed text-ink/75 sm:text-lg">{item.excerpt}</p>
        ) : null}
        <CardLocation item={item} />
        <ReadMore item={item} readMoreLabel={readMoreLabel} unavailableLabel={unavailableLabel} />
      </div>
    </article>
  );
}

function TallCard({ item, kind, readMoreLabel, unavailableLabel }: CardProps) {
  // An icon tile cannot carry overlaid text, so services stack the tile above the text instead.
  if (kind === "service") {
    return (
      <article
        className={`${cardInteraction} ${item.href ? cardHover : ""} flex min-h-[440px] flex-col gap-5 rounded-[28px] bg-surface p-3 sm:p-4 md:h-full lg:rounded-[40px]`}
      >
        <div className="relative min-h-[220px] flex-1 overflow-hidden rounded-[22px] lg:rounded-[32px]">
          <FeedImage item={item} kind={kind} sizes="480px" />
        </div>
        <div className="min-w-0 px-2 pb-3 sm:px-3">
          <CardMeta item={item} />
          <h3 className="landing-title mt-3 line-clamp-3 break-words text-[clamp(1.6rem,2.4vw,2.25rem)] leading-[1.05] text-charcoal [overflow-wrap:anywhere]">
            <CardLink item={item} />
          </h3>
          {item.excerpt ? (
            <p className="landing-copy mt-3 line-clamp-3 font-landing-copy text-sm leading-relaxed text-ink/75">{item.excerpt}</p>
          ) : null}
          <ReadMore item={item} readMoreLabel={readMoreLabel} unavailableLabel={unavailableLabel} />
        </div>
      </article>
    );
  }

  return (
    <article
      className={`${cardInteraction} ${item.href ? cardHover : ""} isolate flex min-h-[440px] flex-col justify-end overflow-hidden rounded-[28px] bg-line p-6 sm:p-8 md:h-full lg:rounded-[40px]`}
    >
      <div className="absolute inset-0 -z-10">
        <FeedImage item={item} kind={kind} sizes="(max-width: 767px) calc(100vw - 40px), 480px" />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-charcoal from-15% via-charcoal/75 via-45% to-charcoal/10" />
      <CardMeta item={item} onImage />
      <h3 className="landing-title mt-3 line-clamp-3 break-words text-[clamp(1.6rem,2.4vw,2.25rem)] leading-[1.05] text-white [overflow-wrap:anywhere]">
        <CardLink item={item} />
      </h3>
      {item.excerpt ? (
        <p className="landing-copy mt-3 line-clamp-2 font-landing-copy text-sm leading-relaxed text-white/80">{item.excerpt}</p>
      ) : null}
      <CardLocation item={item} onImage />
    </article>
  );
}

function RowCard({ item, reverse = false, kind }: CardProps) {
  return (
    <article
      className={`${cardInteraction} ${item.href ? cardHover : ""} flex flex-col gap-4 rounded-[24px] bg-surface p-3 sm:items-center sm:gap-5 lg:rounded-[35px] ${
        reverse ? "sm:flex-row-reverse" : "sm:flex-row"
      }`}
    >
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-[18px] sm:aspect-[205/175] sm:w-[34%] lg:rounded-[28px]">
        <FeedImage item={item} kind={kind} sizes="(max-width: 639px) calc(100vw - 64px), 240px" />
      </div>
      <div className={`min-w-0 flex-1 px-2 pb-2 sm:py-2 ${reverse ? "sm:pl-3 sm:pr-0" : "sm:pl-0 sm:pr-3"}`}>
        <CardMeta item={item} />
        <h3 className="mt-2.5 line-clamp-2 break-words text-xl leading-tight text-charcoal [overflow-wrap:anywhere] lg:text-[1.4rem]">
          <CardLink item={item} />
        </h3>
        {item.excerpt ? (
          <p className="landing-copy mt-2 line-clamp-2 font-landing-copy text-sm leading-relaxed text-ink/70">{item.excerpt}</p>
        ) : null}
        <CardLocation item={item} />
      </div>
    </article>
  );
}

function FeedBlock({
  items,
  mirrored,
  priority,
  options
}: {
  items: FeedItem[];
  mirrored: boolean;
  priority: boolean;
  options: FeedOptions;
}) {
  const [feature, ...rest] = items;
  const [tall, ...rows] = rest;

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <Reveal>
        <WideCard item={feature} reverse={mirrored} priority={priority} {...options} />
      </Reveal>

      {rows.length > 0 ? (
        <div
          className={`grid gap-6 lg:gap-8 ${
            mirrored ? "md:grid-cols-[minmax(0,655fr)_minmax(0,454fr)]" : "md:grid-cols-[minmax(0,454fr)_minmax(0,655fr)]"
          }`}
        >
          <Reveal className="md:h-full">
            <TallCard item={tall} {...options} />
          </Reveal>
          <div className={`flex flex-col gap-5 lg:gap-6 ${mirrored ? "md:order-first" : ""}`}>
            {rows.map((row, index) => (
              <Reveal key={row.id} delay={index * 80}>
                <RowCard item={row} reverse={index % 2 === 1} {...options} />
              </Reveal>
            ))}
          </div>
        </div>
      ) : tall ? (
        <Reveal>
          <WideCard item={tall} reverse={!mirrored} {...options} />
        </Reveal>
      ) : null}
    </div>
  );
}

type EditorialFeedProps = {
  items: FeedItem[];
  kind?: FeedKind;
  readMoreLabel?: string;
  unavailableLabel?: string;
};

export function EditorialFeed({
  items,
  kind = "news",
  readMoreLabel = "Baca selengkapnya",
  unavailableLabel = "Segera tersedia"
}: EditorialFeedProps) {
  const blocks: FeedItem[][] = [];
  for (let index = 0; index < items.length; index += BLOCK_SIZE) {
    blocks.push(items.slice(index, index + BLOCK_SIZE));
  }
  const options = { kind, readMoreLabel, unavailableLabel };

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      {blocks.map((block, index) => (
        <FeedBlock key={block[0].id} items={block} mirrored={index % 2 === 1} priority={index === 0} options={options} />
      ))}
    </div>
  );
}
