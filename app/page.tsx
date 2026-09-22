import Image from "next/image";
import Link from "next/link";
import { ArrowUpLeft, ArrowUpRight, CalendarDays, Landmark, Newspaper, Play, UsersRound } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LandingNewsCarousel } from "@/components/LandingNewsCarousel";
import { MotionScene } from "@/components/MotionScene";
import { Reveal } from "@/components/Reveal";
import { getBidangList, getProgramUnggulanCount } from "@/lib/bidang-public";
import { getPublikasiPaginated } from "@/lib/publikasi-public";

const serviceItems = [
  {
    title: "Direktori bidang",
    description: "Kenali unit kerja, fokus gerak, serta orang-orang di balik Kabinet Dipanegara.",
    href: "#bidang",
    label: "Organisasi",
    icon: Landmark
  },
  {
    title: "Publikasi",
    description: "Ikuti rilis kebijakan, kabar program, dan catatan gerakan mahasiswa UNDIP.",
    href: "/publikasi",
    label: "Informasi",
    icon: Newspaper
  },
  {
    title: "Agenda",
    description: "Temukan forum, kelas publik, dan kegiatan yang dapat kamu ikuti.",
    href: "/agenda",
    label: "Kegiatan",
    icon: CalendarDays
  }
];

export default async function Home() {
  const [bidangList, publicationList, programCount] = await Promise.all([
    getBidangList(),
    getPublikasiPaginated(1, 6),
    getProgramUnggulanCount()
  ]);

  const memberCount = bidangList.reduce(
    (total, bidang) => total + (Number.isFinite(Number(bidang.jumlah_anggota)) ? Number(bidang.jumlah_anggota) : 0),
    0
  );
  const organizationColumns = [
    bidangList.slice(0, Math.ceil(bidangList.length / 2)),
    bidangList.slice(Math.ceil(bidangList.length / 2))
  ];
  const newsItems = publicationList.map((item) => ({
    id: item.id_publikasi,
    title: item.judul_publikasi,
    excerpt: item.isi_publikasi,
    image: item.gambar_publikasi,
    category: item.kategori_publikasi,
    date: String(item.tanggal_publikasi)
  }));

  return (
    <>
      <Header />
      <MotionScene />
      <main id="main-content" className="landing-page overflow-hidden">
        <section
          id="beranda"
          className="landing-grain relative flex min-h-[620px] items-center overflow-hidden pb-12 pt-28 sm:min-h-[700px] sm:pb-16 sm:pt-32 lg:min-h-[800px] lg:pt-32"
        >
          <div className="landing-container relative flex flex-col items-center text-center">
            <Reveal className="is-visible w-full">
              <div className="relative mx-auto mt-5 w-full max-w-[520px] sm:mt-6 sm:max-w-[650px] lg:max-w-[760px]">
                <Image
                  src="/assets/hero_image.png"
                  alt="Ilustrasi warung makan sebagai identitas visual Kabinet Dipanegara"
                  width={755}
                  height={627}
                  priority
                  sizes="(max-width: 640px) calc(100vw - 40px), (max-width: 1024px) 650px, 760px"
                  className="h-auto w-full object-contain"
                />
              </div>
            </Reveal>
          </div>
        </section>

        <section id="sambutan" className="relative bg-white pb-14 sm:pb-[72px] lg:pb-24">
          <div className="landing-container relative overflow-hidden rounded-[24px] bg-accent p-2 text-white shadow-[0_24px_64px_rgba(187,63,23,0.14)] sm:rounded-[30px]">
            <Image
              src="/assets/landing/welcome-art.svg"
              alt=""
              fill
              sizes="100vw"
              className="pointer-events-none select-none object-fill opacity-70"
            />
            <div className="relative z-10 rounded-[18px] border-2 border-white/70 px-5 py-7 sm:rounded-[24px] sm:px-8 sm:py-10 lg:px-10 lg:py-10">
              <Reveal>
                <p className="landing-copy mx-auto w-fit max-w-3xl break-words rounded-[10px] border-2 border-white/80 px-5 py-2.5 text-center text-sm font-bold leading-snug sm:text-lg">
                  Selamat datang di rumah digital BEM UNDIP 2026!
                </p>
              </Reveal>

              <div className="mt-6 rounded-[16px] border-2 border-white/50 px-5 py-6 sm:mt-8 sm:px-8 sm:py-8">
                <Reveal>
                  <p className="landing-copy font-sans text-sm leading-7 text-white/95 sm:text-base sm:leading-8">
                    BEM UNDIP 2026 berkomitmen penuh untuk merawat spirit perjuangan Pangeran Diponegoro,
                    menjadi katalisator bagi perbaikan dan perubahan di lingkungan kampus, regional, maupun nasional.
                  </p>
                  <p className="landing-copy mt-4 font-sans text-sm leading-7 text-white/95 sm:text-base sm:leading-8">
                    Maka dari itu, mari merajut kembali simpul-simpul gerakan, memperjuangkan hak-hak yang
                    terpinggirkan, dan membawa dampaknya bagi almamater dan Indonesia.
                  </p>
                  <p className="landing-copy mt-4 font-sans text-sm leading-7 text-white/95 sm:text-base sm:leading-8">
                    Hidup Mahasiswa.
                    <br />
                    Hidup Rakyat Indonesia.
                    <br />
                    Hidup Perempuan yang Melawan.
                  </p>
                </Reveal>

                <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:mt-12">
                  <Reveal>
                    <div className="relative pb-4 pl-3 pt-2">
                      <div className="absolute inset-0 right-3 top-4 rotate-2 rounded-[18px] bg-accent-deep/40" />
                      <article className="relative rounded-[18px] bg-accent-deep/30 p-3 shadow-[0_14px_28px_rgba(0,0,0,0.18)] sm:p-4">
                        <p className="rounded-[12px] bg-charcoal/30 py-2 text-center font-sans text-xs font-bold uppercase tracking-[0.24em] text-white">
                          Visi
                        </p>
                        <div className="mt-3 aspect-[4/3] w-full rounded-[14px] bg-[#B9B9B9]" />
                      </article>
                      <span className="absolute -bottom-1 left-0 flex h-9 w-9 items-center justify-center rounded-full bg-ink text-white shadow-[0_8px_16px_rgba(0,0,0,0.3)]">
                        <ArrowUpLeft size={16} />
                      </span>
                    </div>
                  </Reveal>
                  <Reveal delay={100}>
                    <div className="relative pb-4 pr-3 pt-2">
                      <div className="absolute inset-0 left-3 top-4 -rotate-2 rounded-[18px] bg-accent-deep/40" />
                      <article className="relative rounded-[18px] bg-accent-deep/30 p-3 shadow-[0_14px_28px_rgba(0,0,0,0.18)] sm:p-4">
                        <p className="rounded-[12px] bg-charcoal/30 py-2 text-center font-sans text-xs font-bold uppercase tracking-[0.24em] text-white">
                          Misi
                        </p>
                        <div className="mt-3 aspect-[4/3] w-full rounded-[14px] bg-[#B9B9B9]" />
                      </article>
                      <span className="absolute -bottom-1 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-ink text-white shadow-[0_8px_16px_rgba(0,0,0,0.3)]">
                        <ArrowUpRight size={16} />
                      </span>
                    </div>
                  </Reveal>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="bidang" className="relative rounded-[28px] bg-surface py-14 sm:rounded-[36px] sm:py-[72px] lg:py-24">
          <div className="landing-container">
            <Reveal>
              <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="font-sans text-xs font-semibold uppercase tracking-[0.28em] text-accent-deep">Rumah gerak</p>
                  <h2 className="landing-title mt-3 text-[clamp(2.35rem,5.8vw,4.25rem)] leading-none text-charcoal">
                    Bidang, biro dan kantor
                  </h2>
                </div>
                <p className="landing-copy max-w-sm font-sans text-sm leading-relaxed text-ink/65">
                  Setiap unit bekerja dengan mandat berbeda, tetapi bergerak menuju tujuan yang sama.
                </p>
              </div>
            </Reveal>

            {bidangList.length > 0 ? (
              <div className="mt-8 grid gap-x-12 lg:grid-cols-2">
                {organizationColumns.map((column, columnIndex) => (
                  <div key={columnIndex}>
                    {column.map((bidang, index) => (
                      <Reveal key={bidang.id} delay={(index % 5) * 60}>
                        <article className="group border-b border-line py-5 sm:py-6">
                          <Link
                            href={`/bidang/${bidang.id}`}
                            className="grid gap-5 rounded-[4px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink sm:grid-cols-[1fr_auto] sm:items-center"
                          >
                            <div className="min-w-0">
                              <h3 className="landing-copy font-landing-directory text-[clamp(1.3rem,2.5vw,2rem)] leading-tight text-ink transition group-hover:text-accent-deep">
                                {bidang.nama_bidang}
                              </h3>
                              <p className="mt-2 line-clamp-2 font-sans text-sm leading-relaxed text-ink/60">
                                {bidang.deskripsi || `Kenali peran dan program ${bidang.nama_bidang}.`}
                              </p>
                            </div>
                            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-bold text-white transition group-hover:-translate-y-0.5 group-hover:bg-accent-deep">
                              Lihat
                              <ArrowUpRight size={17} />
                            </span>
                          </Link>
                        </article>
                      </Reveal>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-12 rounded-[24px] border border-dashed border-line bg-white p-10 text-center font-sans text-ink/60">
                Direktori bidang sedang disiapkan.
              </div>
            )}
          </div>
        </section>

        <section id="berita" className="bg-white py-14 sm:py-[72px] lg:py-24">
          <div className="landing-container">
            <Reveal>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="font-script text-4xl text-ink/70 sm:text-[2.75rem]">Berita terkini</p>
                  <h2 className="sr-only">Berita terkini BEM UNDIP</h2>
                </div>
                <Link
                  href="/publikasi"
                  className="inline-flex w-fit items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white transition hover:bg-accent-deep active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
                >
                  Semua publikasi
                  <ArrowUpRight size={18} />
                </Link>
              </div>
            </Reveal>

            {newsItems.length > 0 ? (
              <LandingNewsCarousel items={newsItems} />
            ) : (
              <div className="mt-12 rounded-[28px] bg-surface p-12 text-center font-sans text-ink/60">
                Berita terbaru sedang disiapkan.
              </div>
            )}
          </div>
        </section>

        <section className="relative overflow-hidden bg-white py-14 sm:py-[72px] lg:py-24">
          <div className="absolute -left-[28%] top-[36%] h-[280px] w-[160%] -rotate-6 rounded-[50%] bg-accent sm:h-[400px]" aria-hidden="true" />
          <Image
            src="/assets/landing/company-accent.svg"
            alt=""
            width={270}
            height={281}
            className="absolute -right-10 bottom-5 h-32 w-32 rotate-12 sm:h-48 sm:w-48"
          />
          <div className="landing-container relative z-10">
            <Reveal>
              <h2 className="landing-title text-center text-[clamp(2.1rem,4.5vw,3.5rem)] leading-tight text-charcoal">
                Tonton company profile kami di sini
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <div className="mx-auto mt-8 max-w-3xl overflow-hidden rounded-[24px] bg-[#D9D9D9] p-3 shadow-[0_22px_58px_rgba(52,64,84,0.18)] sm:rounded-[32px] sm:p-5">
                <div className="relative grid aspect-video place-items-center overflow-hidden rounded-[18px] bg-gradient-to-br from-[#E5E7EB] to-[#BFC5CC] sm:rounded-[24px]">
                  <Image
                    src="/assets/bemundip.png"
                    alt="Logo BEM UNDIP pada poster company profile"
                    width={240}
                    height={180}
                    loading="lazy"
                    className="h-auto w-24 object-contain opacity-35 sm:w-36"
                  />
                  <a
                    href="https://www.youtube.com/@bemundip"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute grid h-16 w-16 place-items-center rounded-full bg-accent text-white shadow-float transition hover:scale-105 hover:bg-accent-deep active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                    aria-label="Buka kanal YouTube BEM UNDIP di tab baru"
                  >
                    <Play size={24} fill="currentColor" className="ml-1" />
                  </a>
                </div>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <p className="landing-copy mx-auto mt-8 max-w-3xl text-justify font-landing-copy text-base leading-8 text-charcoal sm:text-lg">
                Sebuah langkah, tekad, dan arah gerak kini berlabuh. Kabinet Dipanegara membawa semangat kolaborasi,
                aksi nyata, dan kebermanfaatan ke dalam satu ruang pandang. Kenali bagaimana kami merajut asa,
                menjawab tantangan zaman, dan menjadi wadah perjuangan yang progresif bagi mahasiswa serta masyarakat.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="bg-white py-14 sm:py-[72px] lg:py-24">
          <div className="landing-container">
            <Reveal>
              <h2 className="landing-title text-center text-[clamp(2.35rem,5.8vw,4.25rem)] leading-none text-charcoal">
                Beri Rasa, Lahir Makna.
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-7 sm:grid-cols-3 sm:gap-4">
              {[
                { value: bidangList.length, label: "Bidang/Biro/Kantor/Unit" },
                { value: memberCount > 0 ? `${memberCount}+` : "450+", label: "Pengurus" },
                { value: programCount, label: "Program kerja" }
              ].map((stat, index) => (
                <Reveal key={stat.label} delay={index * 100}>
                  <div className="border-t border-line pt-5 text-center sm:border-l sm:border-t-0 sm:first:border-l-0 sm:pt-0">
                    <p className="font-landing-stat text-[clamp(3rem,7vw,4.5rem)] tabular-nums leading-none text-charcoal">
                      {stat.value}
                    </p>
                    <p className="mt-3 font-sans text-sm font-medium text-ink/70 sm:text-base">{stat.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="layanan" className="bg-white py-14 sm:py-[72px] lg:py-24">
          <div className="landing-container">
            <Reveal>
              <div className="flex items-end justify-between gap-5">
                <div>
                  <p className="font-sans text-xs font-semibold uppercase tracking-[0.28em] text-accent-deep">Akses cepat</p>
                  <h2 className="landing-title mt-3 text-[clamp(2.35rem,5.8vw,4.25rem)] leading-none text-charcoal">Layanan kami</h2>
                </div>
                <UsersRound className="hidden text-accent sm:block" size={44} strokeWidth={1.4} />
              </div>
            </Reveal>
            <div className="mt-9 grid gap-5 md:grid-cols-3">
              {serviceItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Reveal key={item.title} delay={index * 100}>
                    <Link
                      href={item.href}
                      className="group flex min-h-[330px] flex-col rounded-[24px] bg-surface p-5 transition duration-300 hover:-translate-y-2 hover:shadow-float focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
                    >
                      <div className="relative grid h-40 place-items-center overflow-hidden rounded-[18px] bg-[#FFF3A8]">
                        <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-accent/70" />
                        <div className="absolute -bottom-12 -left-9 h-32 w-32 rounded-full bg-white/70" />
                        <Icon className="relative text-ink" size={56} strokeWidth={1.35} />
                        <span className="absolute bottom-3 right-3 grid h-11 w-11 place-items-center rounded-full bg-ink transition group-hover:-translate-y-1 group-hover:translate-x-1">
                          <Image src="/assets/landing/arrow-up-right.svg" alt="" width={20} height={20} className="h-5 w-5" />
                        </span>
                      </div>
                      <span className="mt-5 w-fit rounded-full bg-white px-3.5 py-1.5 font-sans text-xs font-semibold text-charcoal">
                        {item.label}
                      </span>
                      <h3 className="mt-4 text-[1.75rem] leading-none text-ink">{item.title}</h3>
                      <p className="landing-copy mt-3 font-sans text-sm leading-relaxed text-ink/65">{item.description}</p>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
