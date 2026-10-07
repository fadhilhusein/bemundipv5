import { Search } from "lucide-react";

type SearchFormProps = {
  /** Page that receives `?q=`, e.g. "/agenda". */
  action: string;
  defaultValue?: string;
  placeholder: string;
  /** Screen-reader label describing what is searched. */
  label: string;
  inputId: string;
};

/** Plain GET form so search works without JavaScript and results get a shareable URL. */
export function SearchForm({ action, defaultValue = "", placeholder, label, inputId }: SearchFormProps) {
  return (
    <form action={action} method="get" role="search" className="relative w-full max-w-xl">
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <input
        id={inputId}
        type="search"
        name="q"
        defaultValue={defaultValue}
        maxLength={100}
        autoComplete="off"
        enterKeyHint="search"
        placeholder={placeholder}
        className="h-12 w-full rounded-full border border-white bg-accent pl-5 pr-12 font-landing-serif text-base text-charcoal shadow-[0_6px_16px_rgba(187,63,23,0.12)] outline-none transition placeholder:text-charcoal/70 focus-visible:ring-4 focus-visible:ring-accent/35 [&::-webkit-search-cancel-button]:hidden"
      />
      <button
        type="submit"
        aria-label={label}
        className="absolute right-1 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full text-charcoal transition hover:bg-white/30 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal"
      >
        <Search size={20} strokeWidth={2.25} aria-hidden="true" />
      </button>
    </form>
  );
}
