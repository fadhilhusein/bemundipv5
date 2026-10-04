// Inserts temporary dummy content (berita, agenda, layanan, program unggulan, media sosial) so the
// public pages can be previewed. Every inserted row is recorded in manifest.json; run
// `npm run dummy:clear` to delete exactly those rows before entering real data.
// Existing rows (bidang, kabinet, anggota, admins, users) are only read, never changed.
import { existsSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";

const MANIFEST_PATH = join(dirname(fileURLToPath(import.meta.url)), "manifest.json");

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL belum diatur.");
  process.exit(1);
}
if (existsSync(MANIFEST_PATH)) {
  console.error("Data dummy sudah ada (manifest.json ditemukan). Jalankan `npm run dummy:clear` dulu sebelum seed ulang.");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

const IMAGES = [
  "https://res.cloudinary.com/lhpae4r1/image/upload/v1790879509/bemundip/publikasi/iqcvd5snirtn4lbiyure.jpg",
  "https://res.cloudinary.com/lhpae4r1/image/upload/v1790879432/bemundip/publikasi/bpl8pdjv5dvd6vfd6du3.jpg",
  "https://res.cloudinary.com/lhpae4r1/image/upload/v1790879416/bemundip/publikasi/d7jhnm6zrivniq7m9a1n.jpg",
  "https://res.cloudinary.com/lhpae4r1/image/upload/v1790878644/bemundip/publikasi/uzuw4ultjyceg0d2gbld.jpg",
  "https://res.cloudinary.com/lhpae4r1/image/upload/v1790879902/bemundip/publikasi/jninrqn3yknutpywlizs.jpg",
  "https://res.cloudinary.com/lhpae4r1/image/upload/v1790880066/bemundip/publikasi/shhigiqfbmaxlwltlyv2.jpg"
];
const image = (index) => IMAGES[index % IMAGES.length];

const MONTHS = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

// Dates are relative to today (Asia/Jakarta) so agenda statuses stay meaningful whenever the seed runs.
const todayKey = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(new Date());
const today = new Date(`${todayKey}T00:00:00Z`);
const day = (offset) => new Date(today.getTime() + offset * 86_400_000);
const tanggal = (offset) => {
  const date = day(offset);
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
};
const rentang = (from, to) => `${tanggal(from)} – ${tanggal(to)}`;
const timestamp = (offset, hour = 10) => `${day(offset).toISOString().slice(0, 10)} ${String(hour).padStart(2, "0")}:00:00`;

const [penulis] = await sql`SELECT id_user FROM users ORDER BY id_user LIMIT 1`;
const [kabinet] = await sql`SELECT id_kabinet FROM master_kabinet ORDER BY id_kabinet LIMIT 1`;
const bidangRows = await sql`SELECT id FROM bidang ORDER BY id`;
if (!penulis || !kabinet || bidangRows.length === 0) {
  console.error("Butuh minimal 1 user, 1 kabinet, dan 1 bidang di database untuk membuat data dummy.");
  process.exit(1);
}
const bidang = (index) => bidangRows[index % bidangRows.length].id;

const publikasi = [
  ["BEM UNDIP Kawal Penetapan UKT 2026 Bersama Perwakilan Fakultas", "Berita", -2],
  ["Pembukaan Pendaftaran Staf Magang Kabinet Dipanegara", "Pengumuman", -4],
  ["Rilis Sikap: Ruang Aman bagi Mahasiswa di Lingkungan Kampus", "Rilis Pers", -6],
  ["Gelar Wani x Temu Puan Hadirkan 20 Tenant Usaha Perempuan", "Event", -9],
  ["Forum Diskusi Isu Ketenagakerjaan Bersama Alumni", "Berita", -12],
  ["Jadwal Layanan Sekretariat Selama Masa Ujian Tengah Semester", "Pengumuman", -15],
  ["Catatan Gerakan: Mengapa Partisipasi Mahasiswa Tetap Penting", "Opini", -18],
  ["Bidang Lingkungan Hidup Tanam 500 Bibit di Kawasan Tembalang", "Berita", -22],
  ["Hasil Audiensi Fasilitas Kampus dengan Pihak Rektorat", "Rilis Pers", -26],
  ["Pekan Olahraga Mahasiswa Resmi Dibuka", "Event", -30],
  ["Panduan Mengajukan Aspirasi Melalui Kanal Resmi BEM", "Pengumuman", -35],
  ["Kolaborasi BEM UNDIP dan Komunitas UMKM Semarang", "Berita", -41],
  ["Refleksi 100 Hari Kerja Kabinet Dipanegara", "Opini", -48],
  ["Sosialisasi Program Beasiswa untuk Mahasiswa Baru", "Pengumuman", -55]
].map(([judul, kategori, offset], index) => ({
  judul,
  kategori,
  tanggal: timestamp(offset, 9 + (index % 8)),
  gambar: index % 5 === 4 ? null : image(index),
  isi: [
    `${judul}. Kegiatan ini menjadi bagian dari agenda Kabinet Dipanegara untuk memperkuat peran mahasiswa di lingkungan Universitas Diponegoro.`,
    "Dalam kesempatan tersebut, perwakilan bidang, biro, dan kantor BEM UNDIP menyampaikan perkembangan program serta membuka ruang tanya jawab dengan mahasiswa yang hadir.",
    "BEM UNDIP mengajak seluruh mahasiswa untuk terus mengikuti informasi terbaru melalui kanal resmi dan menyampaikan aspirasinya agar program yang berjalan semakin tepat sasaran."
  ].join("\n\n")
}));

const agenda = [
  ["Diskusi Publik: Perempuan di Ambang Lantai Dunia Kerja", `${tanggal(6)}, 19.00 WIB`, "Gedung SA MWA Lt. 1", 0, "akan_datang"],
  ["Kelas Advokasi Kampus Angkatan II", rentang(12, 13), "Ruang Sidang Rektorat", null, "akan_datang"],
  ["Lomba Esai Lingkungan Hidup 2026", `Batas pengumpulan ${tanggal(20)}`, "Online", 1, "akan_datang"],
  ["Forum Aspirasi Mahasiswa Baru", `${tanggal(27)}, 13.00 WIB`, "Online via Zoom", 2, "akan_datang"],
  ["Riset Bersama: Kebijakan Kampus", tanggal(35), "Perpustakaan Widya Puraya", null, "akan_datang"],
  ["Gelar Wani x Temu Puan 2026", rentang(-1, 2), "Muladi Dome", 4, "akan_datang"],
  ["Turnamen Futsal Antar Fakultas", `${tanggal(0)}, 15.30 WIB`, "GOR Undip", 3, "akan_datang"],
  ["Malam Apresiasi Seni", tanggal(-18), "Gedung Prof. Soedarto", 5, "akan_datang"],
  ["Pelatihan Kepemimpinan Dasar", rentang(-40, -39), "Auditorium FIB", null, "selesai"],
  ["Rapat Pembahasan Draft Peraturan Rektor", tanggal(-60), "Gedung SA MWA Lt. 1", 0, "akan_datang"],
  ["Bazar UMKM Mahasiswa", tanggal(15), "Lapangan Widya Puraya", 1, "dibatalkan"],
  ["Kajian Rutin Sosial Politik", "Setiap Kamis, 16.00 WIB", "Sekretariat BEM UNDIP", 2, "akan_datang"]
].map(([judul, timeline, lokasi, poster, status], index) => ({
  judul,
  timeline,
  lokasi,
  status,
  poster: poster === null ? null : image(poster),
  link: index % 4 === 3 ? null : `https://example.com/daftar/agenda-${index + 1}`,
  bidang: bidang(index),
  deskripsi: [
    `${judul} merupakan agenda Kabinet Dipanegara yang terbuka untuk seluruh mahasiswa Universitas Diponegoro.`,
    "Peserta akan mengikuti sesi materi bersama narasumber, diskusi kelompok, dan tanya jawab. Sertifikat keikutsertaan diberikan kepada peserta yang mengikuti kegiatan sampai selesai.",
    "Kuota peserta terbatas. Pastikan kamu mendaftar melalui tautan resmi dan memantau informasi terbaru di media sosial BEM UNDIP."
  ].join("\n\n")
}));

const layanan = [
  ["Advokasi Mahasiswa", "Pendampingan untuk masalah akademik, administrasi, dan keuangan kuliah."],
  ["Kanal Aspirasi", "Sampaikan kritik, saran, dan aspirasi untuk kampus maupun BEM UNDIP."],
  ["Informasi Beasiswa", "Rangkuman beasiswa internal dan eksternal yang sedang dibuka."],
  ["Peminjaman Ruang Sekretariat", "Ajukan peminjaman ruang sekretariat untuk kegiatan organisasi mahasiswa."],
  ["Konsultasi Kesehatan Mental", "Rujukan layanan konseling dan pendampingan kesehatan mental."],
  ["Bantuan Desain Publikasi", "Dukungan desain untuk publikasi kegiatan kolaborasi bersama BEM UNDIP."]
];

const programs = [
  ["Sekolah Gerakan", 0], ["Kampus Ramah Perempuan", 0],
  ["Kelas Riset Mahasiswa", 1], ["Jurnal Kebijakan Kampus", 1],
  ["Undip Bersih Bersama", 2], ["Bank Sampah Mahasiswa", 2],
  ["Festival Seni Diponegoro", 3], ["Liga Olahraga Fakultas", 3]
];

const socials = [
  ["Instagram", "@bemundip", "https://www.instagram.com/bemundip"],
  ["X", "@bemundip", "https://x.com/bemundip"],
  ["YouTube", "@bemundip", "https://www.youtube.com/@bemundip"],
  ["TikTok", "@bemundip", "https://www.tiktok.com/@bemundip"]
];

const queries = [
  ...publikasi.map(
    (row) => sql`
      INSERT INTO publikasi_terkini (id_penulis, judul_publikasi, isi_publikasi, gambar_publikasi, tanggal_publikasi, kategori_publikasi)
      VALUES (${penulis.id_user}, ${row.judul}, ${row.isi}, ${row.gambar}, ${row.tanggal}, ${row.kategori})
      RETURNING id_publikasi AS id, judul_publikasi AS title`
  ),
  ...agenda.map(
    (row) => sql`
      INSERT INTO agenda (id_bidang, judul_agenda, deskripsi_program, timeline_agenda, lokasi, poster_agenda, link_pendaftaran, status_agenda)
      VALUES (${row.bidang}, ${row.judul}, ${row.deskripsi}, ${row.timeline}, ${row.lokasi}, ${row.poster}, ${row.link}, ${row.status})
      RETURNING id_agenda AS id, judul_agenda AS title`
  ),
  ...layanan.map(
    ([nama, deskripsi], index) => sql`
      INSERT INTO layanan (id_kabinet, nama_layanan, deskripsi_layanan, link_layanan, urutan_tampil)
      VALUES (${kabinet.id_kabinet}, ${nama}, ${deskripsi}, ${`https://example.com/layanan/${index + 1}`}, ${index + 1})
      RETURNING id_layanan AS id, nama_layanan AS title`
  ),
  ...programs.map(
    ([nama, bidangIndex], index) => sql`
      INSERT INTO program_unggulan (id_bidang, nama_program, deskripsi_program, gambar_program, tanggal_waktu_program)
      VALUES (${bidang(bidangIndex)}, ${nama}, ${`${nama} adalah program unggulan yang dijalankan sepanjang periode Kabinet Dipanegara.`}, ${image(index)}, ${timestamp(10 + index * 7, 9)})
      RETURNING id_program AS id, nama_program AS title`
  ),
  ...socials.map(
    ([platform, username, link]) => sql`
      INSERT INTO media_sosial (id_kabinet, platform, username, link_media_sosial)
      VALUES (${kabinet.id_kabinet}, ${platform}, ${username}, ${link})
      RETURNING id_sosmed AS id, platform AS title`
  )
];

// One transaction: either every dummy row is inserted or none are.
const results = await sql.transaction(queries);

const tables = [
  ["publikasi_terkini", publikasi.length],
  ["agenda", agenda.length],
  ["layanan", layanan.length],
  ["program_unggulan", programs.length],
  ["media_sosial", socials.length]
];
const manifest = { createdAt: new Date().toISOString(), tables: {} };
let offset = 0;
for (const [table, count] of tables) {
  manifest.tables[table] = results.slice(offset, offset + count).map(([row]) => ({ id: row.id, title: row.title }));
  offset += count;
}
writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);

console.log("Data dummy berhasil dibuat:");
console.table(Object.fromEntries(tables));
console.log("Hapus kapan saja dengan `npm run dummy:clear`. Halaman publik bisa butuh hingga 60 detik untuk menampilkan data baru (cache).");
