import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Landmark, Newspaper, Play, UsersRound } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LandingNewsCarousel } from "@/components/LandingNewsCarousel";
import { LandingMotion, LandingReveal as Reveal } from "@/components/LandingMotion";
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
  const [bidangResult, publicationResult, programResult] = await Promise.allSettled([
    getBidangList(),
    getPublikasiPaginated(1, 6),
    getProgramUnggulanCount()
  ]);

  const bidangList = bidangResult.status === "fulfilled" ? bidangResult.value : [];
  const publicationList = publicationResult.status === "fulfilled" ? publicationResult.value : [];
  const programCount = programResult.status === "fulfilled" ? programResult.value : null;

  for (const [label, result] of [
    ["direktori bidang", bidangResult],
    ["publikasi", publicationResult],
    ["jumlah program unggulan", programResult]
  ] as const) {
    if (result.status === "rejected") {
      console.warn(`[Landing] Gagal memuat ${label}. Periksa koneksi dan konfigurasi database.`);
    }
  }

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
    <LandingMotion>
      <Header variant="landing" />
      <main id="main-content" className="landing-page w-full max-w-full overflow-x-clip">
        <section
          id="beranda"
          className="landing-grain relative overflow-hidden pb-12 pt-28 md:pb-16 md:pt-32"
        >
          <div className="landing-container relative flex flex-col items-center text-center">
            <h1 className="sr-only">BEM Universitas Diponegoro 2026 — Kabinet Dipanegara</h1>
            <Reveal className="w-full" immediate>
              <div className="relative mx-auto mt-5 w-full max-w-[520px] sm:mt-6 sm:max-w-[650px] lg:max-w-[760px]">
                <Image
                  src="/assets/hero_image.png"
                  alt="Ilustrasi warung makan sebagai identitas visual Kabinet Dipanegara"
                  width={755}
                  height={627}
                  priority
                  sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 767px) min(calc(100vw - 40px), 650px), (max-width: 1023px) 650px, 760px"
                  className="h-auto w-full object-contain"
                />
              </div>
            </Reveal>
          </div>
        </section>

        <section id="sambutan" aria-labelledby="sambutan-title" className="bg-white landing-section">
          <div className="landing-container">
            <Reveal>
              <p className="landing-eyebrow">Sambutan</p>
              <h2 id="sambutan-title" className="landing-title mt-3 max-w-[960px] text-charcoal">
                Selamat datang di rumah digital BEM UNDIP 2026!
              </h2>
            </Reveal>
            <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:gap-12">
              <Reveal>
                <p className="landing-copy landing-body">
                  BEM UNDIP 2026 berkomitmen penuh untuk merawat spirit perjuangan Pangeran Diponegoro,
                  menjadi katalisator bagi perbaikan dan perubahan di lingkungan kampus, regional, maupun nasional.
                </p>
              </Reveal>
              <Reveal delay={100}>
                <p className="landing-copy landing-body">
                  Maka dari itu, mari merajut kembali simpul-simpul gerakan, memperjuangkan hak-hak yang
                  terpinggirkan, dan membawa dampaknya bagi almamater dan Indonesia.
                </p>
              </Reveal>
            </div>
            <Reveal>
              <p className="landing-copy landing-body mt-8 border-t border-line pt-6 font-semibold text-charcoal">
                Hidup Mahasiswa.
                <br />
                Hidup Rakyat Indonesia.
                <br />
                Hidup Perempuan yang Melawan.
              </p>
            </Reveal>

            <div className="mt-10 grid max-w-[960px] grid-flow-dense gap-6 md:grid-cols-2 lg:mt-12">
              {[
                { title: "Visi", message: "Media visi belum tersedia" },
                { title: "Misi", message: "Media misi belum tersedia" }
              ].map((item, index) => (
                <Reveal key={item.title} className="min-w-0" delay={Math.min(index * 75, 150)}>
                  <article className="rounded-[24px] bg-surface p-5 sm:p-6">
                    <h3 className="landing-title text-charcoal">
                      {item.title}
                    </h3>
                    <div className="mt-4 grid aspect-[4/3] w-full place-items-center rounded-[16px] bg-white px-5">
                      <p className="landing-copy text-center font-landing-copy text-base leading-relaxed text-ink">
                        {item.message}
                      </p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="bidang" className="landing-section relative rounded-[28px] bg-surface sm:rounded-[36px]">
          <div className="landing-container">
            <Reveal>
              <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="landing-eyebrow">Rumah gerak</p>
                  <h2 className="landing-title mt-3 text-charcoal">
                    Bidang, biro dan kantor
                  </h2>
                </div>
                <p className="landing-copy landing-body max-w-sm">
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
                              <h3 className="landing-copy font-landing-directory text-ink transition group-hover:text-accent-deep">
                                {bidang.nama_bidang}
                              </h3>
                              <p className="landing-copy landing-body mt-2 line-clamp-2">
                                {bidang.deskripsi || `Kenali peran dan program ${bidang.nama_bidang}.`}
                              </p>
                            </div>
                            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-accent px-4 py-2.5 min-h-11 font-landing-ui text-[15px] font-semibold text-charcoal transition group-hover:-translate-y-0.5 group-hover:bg-accent-deep group-hover:text-white">
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
              <div className="landing-copy landing-body mt-12 rounded-[24px] border border-dashed border-line bg-white p-6 text-center sm:p-10">
                {bidangResult.status === "rejected"
                  ? "Direktori bidang belum dapat dimuat. Silakan muat ulang halaman untuk mencoba kembali."
                  : "Direktori bidang sedang disiapkan."}
              </div>
            )}
          </div>
        </section>

        <section id="berita" className="bg-white landing-section">
          <div className="landing-container">
            <Reveal>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="landing-title text-charcoal">Berita terkini</h2>
                </div>
                <Link
                  href="/publikasi"
                  className="inline-flex w-fit items-center gap-2 rounded-full bg-accent px-5 py-2.5 min-h-11 font-landing-ui text-[15px] font-semibold text-charcoal transition hover:bg-accent-deep hover:text-white active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
                >
                  Semua publikasi
                  <ArrowUpRight size={18} />
                </Link>
              </div>
            </Reveal>

            {newsItems.length > 0 ? (
              <LandingNewsCarousel items={newsItems} />
            ) : (
              <div className="landing-copy landing-body mt-12 rounded-[28px] bg-surface p-6 text-center sm:p-10">
                {publicationResult.status === "rejected"
                  ? "Berita terbaru belum dapat dimuat. Silakan muat ulang halaman untuk mencoba kembali."
                  : "Berita terbaru sedang disiapkan."}
              </div>
            )}
          </div>
        </section>

        <section className="relative overflow-hidden bg-white landing-section">
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
              <h2 className="landing-title text-center text-charcoal">
                Tonton company profile kami di sini
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <div className="mx-auto mt-8 max-w-3xl overflow-hidden rounded-[24px] bg-[#D9D9D9] p-3 shadow-[0_22px_58px_rgba(52,64,84,0.18)] sm:rounded-[32px] sm:p-5">
                <div className="relative grid aspect-video place-items-center overflow-hidden rounded-[18px] bg-gradient-to-br from-[#E5E7EB] to-[#BFC5CC] sm:rounded-[24px]">
                  <Image
                    src="/assets/logo-bem.png"
                    alt="Logo BEM UNDIP pada poster company profile"
                    width={240}
                    height={180}
                    loading="lazy"
                    className="h-auto w-24 object-contain sm:w-36"
                  />
                  <a
                    href="https://www.youtube.com/@bemundip"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute grid h-16 w-16 place-items-center rounded-full bg-accent text-charcoal shadow-float transition hover:scale-[1.025] hover:bg-accent-deep hover:text-white active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                    aria-label="Buka kanal YouTube BEM UNDIP di tab baru"
                  >
                    <Play size={24} fill="currentColor" className="ml-1" />
                  </a>
                </div>
              </div>
            </Reveal>
            <Reveal immediate>
              <div className="mx-auto mt-8 max-w-3xl rounded-[24px] bg-white p-6 sm:p-8">
                <p className="landing-copy landing-body company-profile-copy mx-auto text-left">
                  Sebuah langkah, tekad, dan arah gerak kini berlabuh. Kabinet Dipanegara membawa semangat kolaborasi,
                  aksi nyata, dan kebermanfaatan ke dalam satu ruang pandang. Kenali bagaimana kami merajut asa,
                  menjawab tantangan zaman, dan menjadi wadah perjuangan yang progresif bagi mahasiswa serta masyarakat.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="bg-white landing-section">
          <div className="landing-container">
            <Reveal>
              <h2 className="landing-title text-center text-charcoal">
                Beri Rasa, Lahir Makna.
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                { value: bidangResult.status === "fulfilled" ? bidangList.length : null, label: "Bidang/Biro/Kantor/Unit" },
                { value: bidangResult.status === "fulfilled" ? (memberCount > 0 ? `${memberCount}+` : 0) : null, label: "Pengurus" },
                { value: programCount, label: "Program kerja" }
              ].map((stat, index) => (
                <Reveal key={stat.label} delay={Math.min(index * 75, 150)}>
                  <div className="border-t border-line pt-5 text-center md:border-l md:border-t-0 md:first:border-l-0 md:pt-0">
                    <p className="font-landing-stat text-[clamp(3rem,7vw,4.5rem)] tabular-nums leading-none text-charcoal">
                      {stat.value === null ? (
                        <>
                          <span aria-hidden="true">—</span>
                          <span className="sr-only">Belum tersedia</span>
                        </>
                      ) : stat.value}
                    </p>
                    <p className="landing-copy mt-3 font-landing-copy text-base font-medium text-ink">{stat.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="layanan" className="bg-white landing-section">
          <div className="landing-container">
            <Reveal>
              <div className="flex items-end justify-between gap-5">
                <div>
                  <p className="landing-eyebrow">Akses cepat</p>
                  <h2 className="landing-title mt-3 text-charcoal">Layanan kami</h2>
                </div>
                <UsersRound className="hidden text-accent sm:block" size={44} strokeWidth={1.4} />
              </div>
            </Reveal>
            <div className="mt-9 grid grid-flow-dense gap-6 lg:grid-cols-3">
              {serviceItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Reveal key={item.title} delay={Math.min(index * 75, 150)}>
                    <Link
                      href={item.href}
                      className="group flex min-h-[330px] flex-col rounded-[24px] bg-surface p-5 transition duration-300 hover:-translate-y-1 hover:shadow-float focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
                    >
                      <div className="relative grid h-40 place-items-center overflow-hidden rounded-[18px] bg-[#FFF3A8]">
                        <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-accent/70" />
                        <div className="absolute -bottom-12 -left-9 h-32 w-32 rounded-full bg-white/70" />
                        <Icon className="relative text-ink" size={56} strokeWidth={1.35} />
                        <span className="absolute bottom-3 right-3 grid h-11 w-11 place-items-center rounded-full bg-ink transition group-hover:-translate-y-1 group-hover:translate-x-1">
                          <Image src="/assets/landing/arrow-up-right.svg" alt="" width={20} height={20} className="h-5 w-5" />
                        </span>
                      </div>
                      <span className="mt-5 w-fit rounded-full bg-white px-3.5 py-1.5 font-landing-ui text-sm font-semibold text-charcoal">
                        {item.label}
                      </span>
                      <h3 className="mt-4 text-ink">{item.title}</h3>
                      <p className="landing-copy landing-body mt-3">{item.description}</p>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer variant="landing" />
    </LandingMotion>
  );
}
