type ProgramCardProps = {
  title: string;
  description: string;
};

export function ProgramCard({ title, description }: ProgramCardProps) {
  return (
    <a
      href="#kontak"
      className="group flex min-h-[330px] flex-col rounded-xl border-2 border-clay bg-cream p-5 shadow-card transition duration-[250ms] hover:-translate-y-1.5 hover:shadow-card-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brown"
    >
      <h3 className="text-center text-3xl font-bold leading-[0.95] text-orange sm:text-4xl">
        {title}
      </h3>
      <div className="mt-5 grid aspect-video place-items-center rounded-sm border border-clay/40 bg-[#d7d7d7] text-sm font-semibold tracking-widest text-brown/55 transition group-hover:bg-peach/60">
        /foto dokum/
      </div>
      <p className="mt-5 text-center text-sm font-medium leading-relaxed tracking-wide text-brown sm:text-[15px]">
        {description}
      </p>
    </a>
  );
}
