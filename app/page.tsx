import Image from "next/image";
import {
  Instagram,
  Mail,
  MessageCircle,
  Send,
  Youtube
} from "lucide-react";
import { AgendaCard } from "@/components/AgendaCard";
import { BidangCard } from "@/components/BidangCard";
import { DecorativeImage } from "@/components/DecorativeImage";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MotionScene } from "@/components/MotionScene";
import { EmptyAgenda } from "@/components/EmptyAgenda";
import { EmptyPublikasi } from "@/components/EmptyPublikasi";
import { PublikasiCard } from "@/components/PublikasiCard";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getAgendaPaginated } from "@/lib/agenda-public";
import { getBidangList } from "@/lib/bidang-public";
import { getPublikasiCount, getPublikasiPaginated } from "@/lib/publikasi-public";
import { Pagination } from "@/components/ui/Pagination";

const BERITA_PER_PAGE = 6;
const AGENDA_LIMIT = 3;

const movementSpaces = [
  {
    title: "Departemen",
    description: "Kenali bidang kerja, agenda, dan ruang kolaborasi di dalam kabinet.",
    href: "#bidang"
  },
  {
    title: "Layanan",
    description: "Akses kanal aspirasi, advokasi, informasi beasiswa, dan bantuan kampus.",
    href: "#kontak"
  },
  {
    title: "Publikasi",
    description: "Baca rilis kebijakan, kabar program, dan dokumentasi kegiatan.",
    href: "#berita"
  },
  {
    title: "Agenda",
    description: "Pantau forum, kelas publik, panggung karya, dan kegiatan mahasiswa.",
    href: "#agenda"
  }
];

const mottoItems = [
  {
    title: "Hidup Mahasiswa.",
    description: "Ruang tumbuh yang merawat nalar, karya, dan keberanian."
  },
  {
    title: "Hidup Rakyat Indonesia.",
    description: "Gerak pengabdian yang berpihak pada kemaslahatan bersama."
  },
  {
    title: "Hidup Perempuan yang Melawan.",
    description: "Suara keberanian untuk kampus yang aman dan setara."
  }
];

type HomeProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, Number(pageParam) || 1);

  const [bidangList, publikasiCount, publikasiList, agendaList] = await Promise.all([
    getBidangList(),
    getPublikasiCount(),
    getPublikasiPaginated(currentPage, BERITA_PER_PAGE),
    getAgendaPaginated(1, AGENDA_LIMIT)
  ]);

  const totalPages = Math.max(1, Math.ceil(publikasiCount / BERITA_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const finalPublikasiList =
    currentPage !== safePage && publikasiCount > 0
      ? await getPublikasiPaginated(safePage, BERITA_PER_PAGE)
      : publikasiList;

  return (
    <>
      <Header />
      <MotionScene />
      <main className="w-full max-w-full overflow-x-hidden">
        <section
          id="beranda"
          className="hero-glow hero-stage h-[100svh] relative isolate flex overflow-hidden pb-20 pt-24 text-white lg:pt-28"
        >
          <Image
            src="/assets/UNDIPOfficial-removebg-preview.png"
            alt=""
            width={480}
            height={720}
            priority
            quality={60}
            sizes="(max-width: 768px) 50vw, 480px"
            className="stamp-watermark absolute -left-[54%] top-[10%] h-[72%] w-auto object-contain md:-left-[12%] lg:-left-[7%]"
          />
          <Image
            src="/assets/UNDIPOfficial-removebg-preview.png"
            alt=""
            width={480}
            height={720}
            quality={60}
            sizes="(max-width: 768px) 50vw, 480px"
            className="stamp-watermark absolute -right-[54%] top-[10%] h-[72%] w-auto object-contain md:-right-[12%] lg:-right-[7%]"
          />
          {/* <DecorativeImage
            src="/assets/hand.png"
            width={190}
            height={190}
            rotate={-20}
            data-gsap-image
            className="float-c absolute right-20 top-[39%] z-30 w-32 opacity-90 sm:right-16 sm:w-40 md:w-48 lg:left-20 lg:top-[36%] lg:w-56"
            /> */}

          <Container className="relative z-10 flex flex-1 flex-col items-center text-center">
            <Reveal className="flex pt-5 min-h-full w-full flex-1 flex-col items-center md:justify-start">
              <div className="relative mt-[clamp(1.5rem,4.5vh,3rem)] hidden md:block">
                <DecorativeImage
                  src="/assets/maskot soda.png"
                  width={180}
                  height={135}
                  priority
                  rotate={-5}
                  data-gsap-image
                  className="float-a -left-[35%] w-24 absolute drop-shadow-xl md:w-32 lg:w-44"
                />
                <DecorativeImage
                  src="/assets/maskot kerupuk.png"
                  width={180}
                  height={135}
                  priority
                  rotate={5}
                  data-gsap-image
                  className="float-b absolute -top-[25%] -right-[35%] w-24 drop-shadow-xl md:w-32 lg:-top-[30%] lg:-right-[35%] lg:w-44"
                />
                <div className="flex items-end justify-center gap-2 sm:gap-4 z-20">
                  <span className="font-display hero-title-shadow text-[clamp(2.55rem,10vw,6.2rem)] font-medium leading-[0.76] text-white">
                    Kabinet 
                  </span>
                </div>
                <p className="font-display mt-1 text-[clamp(1rem,3.6vw,2rem)] leading-none text-white z-20">
                    Dipanegara
                </p>
              </div>

              <div className="relative mt-[clamp(4.1rem,12vh,7.1rem)] flex w-full max-w-6xl items-center justify-center px-1 sm:px-8">
                <h1 className="hero-title-shadow flex max-w-full origin-center transform-gpu items-baseline justify-center whitespace-nowrap text-brown">
                  <span className="font-script -mr-[0.08em] text-[clamp(5.7rem,19vw,12rem)] font-normal leading-none">
                    B
                  </span>
                  <span className="font-display -ml-[0.02em] text-[clamp(3.15rem,10.7vw,7rem)] font-medium leading-none">
                    EM
                  </span>
                  <span className="font-script ml-3 -mx-[0.07em] text-[clamp(5.8rem,19vw,12.5rem)] font-normal leading-none">
                    U
                  </span>
                  <span className="font-display text-[clamp(3.15rem,10.7vw,7rem)] font-medium leading-none">
                    NDIP
                  </span>
                </h1>
                {/* <div className="absolute right-[2%] top-[4%] rotate-2 bg-red px-3 py-1.5 font-script text-[clamp(2.1rem,6vw,4.6rem)] leading-none text-white shadow-[0_10px_22px_rgba(64,35,18,0.2)] sm:right-[7%] md:right-[10%]"> */}
                <div className="absolute -bottom-[100%] md:right-[10%] md:top-[5%] md:bottom-[8.5rem] rotate-2 bg-red px-3 py-1.5 font-script text-[clamp(2.1rem,18vw,4.6rem)] md:text-[clamp(2.1rem,3vw,4.6rem)] leading-none text-white shadow-[0_10px_22px_rgba(64,35,18,0.2)] sm:right-[7%] md:right-[10%]">
                  2026
                </div>
              </div>

            <div className="mascot_mobile block lg:hidden">
              <DecorativeImage
                  src="/assets/maskot soda.png"
                  width={180}
                  height={135}
                  priority
                  rotate={-5}
                  data-gsap-image
                  className="float-a -bottom-3 -left-[20%] w-72 absolute drop-shadow-xl md:w-32 lg:w-44"
                />
                <DecorativeImage
                  src="/assets/maskot kerupuk.png"
                  width={180}
                  height={135}
                  priority
                  rotate={5}
                  data-gsap-image
                  className="float-b absolute -bottom-3 -right-[20%] w-72 drop-shadow-xl md:w-32 lg:-top-[30%] lg:-right-[35%] lg:w-44"
                />
            </div>
            </Reveal>
          </Container>

          <div className="absolute inset-x-0 bottom-0 z-20 border-y-2 border-white/70 bg-orange/95 px-4 py-4 text-center font-display text-[clamp(1.5rem,2vw,1rem)] md:text-[clamp(2rem,2vw,4rem)] italic leading-none tracking-wide text-white">
            HIDUP MAHASISWA, HIDUP RAKYAT INDONESIA, HIDUP PEREMPUAN YANG MELAWAN
          </div>
        </section>

        <section className="warm-band relative min-h-[760px] overflow-hidden section-pad">
          <DecorativeImage
            src="/assets/batagor.png"
            width={170}
            height={170}
            rotate={-12}
            data-gsap-image
            className="float-a absolute -left-12 top-14 w-28 md:w-36 lg:left-4 lg:w-44"
          />
          <DecorativeImage
            src="/assets/mie.png"
            width={220}
            height={217}
            rotate={14}
            data-gsap-image
            className="float-b absolute -right-16 top-8 w-36 md:w-44 lg:right-10 lg:w-56"
          />
          <DecorativeImage
            src="/assets/kerupuk.png"
            width={220}
            height={220}
            rotate={-10}
            data-gsap-image
            className="float-c absolute -bottom-20 -left-20 w-48 md:w-56 lg:w-64"
          />
          <DecorativeImage
            src="/assets/batagor.png"
            width={150}
            height={150}
            rotate={18}
            data-gsap-image
            className="float-b absolute bottom-4 right-0 w-28 md:right-8 md:w-36 lg:right-20 lg:w-40"
          />

          <Container>
            <Reveal className="mx-auto max-w-4xl text-center">
              <h2 className="font-display text-[clamp(4.4rem,18vw,9rem)] font-medium leading-[0.82] text-[#a5592a] drop-shadow-[0_5px_14px_rgba(64,35,18,0.22)]">
                Selamat
                <br />
                datang!
              </h2>
              <p data-scrub-copy className="mx-auto mt-10 max-w-[700px] text-[15px] font-medium leading-relaxed tracking-wide text-brown/85 sm:text-lg">
                BEM UNDIP 2026 berkomitmen penuh untuk dapat merawat gerak
                perjuangan mahasiswa Diponegoro dengan menjadi katalisator dan
                penggerak bagi adanya pencerdasan, pelayanan, serta kebermanfaatan
                yang dekat dengan kebutuhan mahasiswa.
              </p>
            </Reveal>

            <div className="mt-14 grid gap-7 text-center md:mt-16 md:grid-cols-3">
              {mottoItems.map((item, index) => (
                <Reveal key={item.title} delay={index * 100}>
                  <h3 className="text-base font-bold text-brown">{item.title}</h3>
                  <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-clay">
                    {item.description}
                  </p>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        <section className="relative min-h-[720px] overflow-hidden bg-white section-pad">
          {/* <div className="pointer-events-none absolute blur-md opacity-30 -top-3 left-1/2 -translate-x-1/2 text-[20vw] font-black leading-none tracking-normal text-[#ebb04a] opacity-95">
            BEMUNDIP
          </div> */}
          <DecorativeImage
            src="/assets/cam.png"
            width={300}
            height={375}
            rotate={65}
            data-gsap-image
            className="float-c absolute -left-20 -bottom-2 0 z-10 hidden w-[40rem] lg:block"
          />          
          <DecorativeImage
            src="/assets/cucumbah.png"
            width={150}
            height={150}
            rotate={12}
            data-gsap-image
            className="float-a absolute -left-8 top-48 w-24 md:left-8 md:w-32 lg:left-auto lg:right-10 lg:top-10 lg:w-40"
          />
          <DecorativeImage
            src="/assets/kerupuk.png"
            width={170}
            height={170}
            rotate={14}
            data-gsap-image
            className="float-b absolute -right-12 bottom-12 w-36 md:w-44 lg:right-6 lg:w-52"
          />

          <Container className="relative z-20 grid min-h-[58vh] items-center gap-10 pt-20 lg:grid-cols-[0.82fr_1.18fr] lg:pt-28">
            <div className="hidden lg:block" />
            <Reveal className="text-center lg:text-left">
              <h2 className="font-display text-[clamp(4rem,15vw,7.2rem)] font-medium leading-[0.84] text-brown">
                Menyala
                <br />
                Bersama
              </h2>
              <p data-scrub-copy className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-red sm:text-lg lg:mx-0">
                Satu rumah gerak untuk advokasi, karya, pelayanan, dan ruang temu
                mahasiswa Universitas Diponegoro.
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-4 lg:justify-start">
                <Button href="#berita">Lihat Berita</Button>
                <Button href="#ruang-gerak" variant="secondary">
                  Ruang Gerak
                </Button>
              </div>
            </Reveal>
          </Container>
        </section>

        <section id="berita" className="relative overflow-hidden bg-[#fffaf4] section-pad">
          <DecorativeImage
            src="/assets/sate.png"
            width={160}
            height={160}
            rotate={-24}
            data-gsap-image
            className="float-a absolute -left-10 top-14 w-28 md:w-36 lg:left-10 lg:w-44"
          />
          <DecorativeImage
            src="/assets/tep.png"
            width={170}
            height={170}
            rotate={16}
            data-gsap-image
            className="float-b absolute -right-12 top-20 w-32 md:w-40 lg:right-10 lg:w-48"
          />
          <Container>
            <Reveal>
              <h2 className="font-display text-center text-[clamp(4.8rem,17vw,8rem)] font-medium leading-none text-brown">
                Berita
              </h2>
            </Reveal>

            {finalPublikasiList.length > 0 ? (
              <>
                <div className="mt-12 grid grid-flow-dense gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {finalPublikasiList.map((publikasi, index) => (
                    <Reveal key={publikasi.id_publikasi} delay={index * 100}>
                      <PublikasiCard
                        id={publikasi.id_publikasi}
                        judul={publikasi.judul_publikasi}
                        isi={publikasi.isi_publikasi}
                        gambar={publikasi.gambar_publikasi}
                        kategori={publikasi.kategori_publikasi}
                        tanggal={publikasi.tanggal_publikasi}
                      />
                    </Reveal>
                  ))}
                </div>

                <Pagination currentPage={safePage} totalPages={totalPages} baseHref="/" anchor="#berita" />

                <p className="mt-4 text-center text-xs font-medium tracking-wide text-clay">
                  Menampilkan {finalPublikasiList.length} dari {publikasiCount} publikasi
                </p>

                <div className="mt-6 text-center">
                  <Button href="/publikasi" variant="secondary">
                    Lihat semua publikasi →
                  </Button>
                </div>
              </>
            ) : (
              <div className="mt-12">
                <EmptyPublikasi variant="homepage" />
              </div>
            )}
          </Container>
        </section>

        <section
          id="ruang-gerak"
          className="relative overflow-hidden bg-orange py-20 text-white sm:py-24 lg:py-32"
        >
          <Image
            src="/assets/UNDIPOfficial-removebg-preview.png"
            alt=""
            width={480}
            height={720}
            loading="lazy"
            className="stamp-watermark absolute -left-24 top-8 h-[84%] w-auto object-contain"
          />
          <Image
            src="/assets/UNDIPOfficial-removebg-preview.png"
            alt=""
            width={480}
            height={720}
            loading="lazy"
            className="stamp-watermark absolute -right-24 top-8 h-[84%] w-auto object-contain"
          />
          <Container className="relative z-10">
            <Reveal>
              <h2 className="font-display mx-auto max-w-2xl text-center text-[clamp(4.6rem,18vw,8rem)] font-medium leading-[0.82]">
                Ruang
                <br />
                gerak
              </h2>
            </Reveal>

            <div className="mx-auto mt-14 grid max-w-5xl grid-flow-dense gap-x-16 gap-y-10 md:grid-cols-2">
              {movementSpaces.map((item, index) => (
                <Reveal key={item.title} delay={index * 90}>
                  <a
                    href={item.href}
                    className="group block min-h-[126px] border-t-4 border-white/85 pt-5 transition hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  >
                    <h3 className="font-display text-4xl leading-none sm:text-5xl">
                      {item.title}
                    </h3>
                    <p className="mt-3 max-w-md text-sm font-medium leading-relaxed tracking-wide text-white/90">
                      {item.description}
                    </p>
                  </a>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        {bidangList.length > 0 && (
          <section id="bidang" className="relative overflow-hidden bg-[#fffaf4] section-pad">
            <Container>
              <Reveal>
                <h2 className="font-display text-center text-[clamp(4.6rem,17vw,8rem)] font-medium leading-none text-brown">
                  Bidang & Biro
                </h2>
                <p className="mx-auto mt-5 max-w-2xl text-center text-sm font-medium leading-relaxed tracking-wide text-brown/80 sm:text-base">
                  Unit kerja yang menggerakkan program dan pelayanan Kabinet BEM UNDIP 2026.
                </p>
              </Reveal>

              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {bidangList.map((bidang, index) => (
                  <Reveal key={bidang.id} delay={index * 100}>
                    <BidangCard
                      id={bidang.id}
                      namaBidang={bidang.nama_bidang}
                      deskripsi={bidang.deskripsi}
                      penanggungJawab={bidang.penanggung_jawab}
                      jumlahAnggota={bidang.jumlah_anggota}
                      gambar={bidang.gambar}
                    />
                  </Reveal>
                ))}
              </div>
            </Container>
          </section>
        )}

        <section id="agenda" className="relative overflow-hidden bg-cream section-pad border-t border-divider">
          <Container>
            <Reveal>
              <h2 className="font-display text-center text-[clamp(4.6rem,17vw,8rem)] font-medium leading-none text-brown">
                Agenda
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-center text-sm font-medium leading-relaxed tracking-wide text-brown/80 sm:text-base">
                Jadwal kegiatan terdekat, forum mahasiswa, dan program kerja Kabinet BEM UNDIP 2026.
              </p>
            </Reveal>

            {agendaList.length > 0 ? (
              <>
                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {agendaList.map((agenda, index) => (
                    <Reveal key={agenda.id_agenda} delay={index * 100}>
                      <AgendaCard
                        id={agenda.id_agenda}
                        judul={agenda.judul_agenda}
                        namaBidang={agenda.nama_bidang}
                        deskripsi={agenda.deskripsi_program}
                        timeline={agenda.timeline_agenda}
                        lokasi={agenda.lokasi}
                        poster={agenda.poster_agenda}
                        linkPendaftaran={agenda.link_pendaftaran}
                        status={agenda.status_agenda}
                      />
                    </Reveal>
                  ))}
                </div>

                <div className="mt-10 text-center">
                  <Button href="/agenda" variant="secondary">
                    Lihat semua agenda →
                  </Button>
                </div>
              </>
            ) : (
              <div className="mt-12">
                <EmptyAgenda />
              </div>
            )}
          </Container>
        </section>

        <section
          id="kontak"
          className="relative overflow-hidden border-t-2 border-white bg-[#dc7027] py-16 text-white sm:py-20"
        >
          <Container className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <Reveal>
              <h2 className="font-display text-center text-[clamp(2.8rem,10vw,4.5rem)] leading-[0.95] lg:text-left">
                Connect With Us!
              </h2>
              <div className="mt-8 flex justify-center gap-3 lg:justify-start">
                {[
                  { icon: Instagram, label: "Instagram" },
                  { icon: Youtube, label: "YouTube" },
                  { icon: Mail, label: "Email" },
                  { icon: MessageCircle, label: "Chat" },
                  { icon: Send, label: "Telegram" }
                ].map(({ icon: Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="grid h-11 w-11 place-items-center rounded-full bg-white text-orange transition hover:-translate-y-1 hover:bg-brown hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  >
                    <Icon size={21} />
                  </a>
                ))}
              </div>
              <p className="mt-5 text-center text-lg font-bold tracking-wide lg:text-left">
                @BEMUNDIP
              </p>
            </Reveal>

            <Reveal delay={120}>
              <form className="mx-auto max-w-xl border-white/85 lg:border-l-2 lg:pl-10">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <label htmlFor="contact-email" className="sr-only">
                    Alamat email atau WhatsApp
                  </label>
                  <input
                    id="contact-email"
                    type="text"
                    placeholder="alamat Email / whatsapp"
                    className="h-[52px] min-w-0 flex-1 rounded-full bg-white px-6 text-sm font-semibold text-brown outline-none placeholder:text-clay/45 focus:ring-4 focus:ring-brown/20"
                  />
                  <Button variant="dark" className="px-7">
                    Kirim
                  </Button>
                </div>
                <p className="mt-5 max-w-md text-sm font-semibold leading-relaxed tracking-wide">
                  tertarik untuk jadi bagian dari keluarga besar UNDIP?
                </p>
              </form>
            </Reveal>
          </Container>
        </section>
      </main>

      <Footer />
    </>
  );
}
