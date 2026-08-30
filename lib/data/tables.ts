import { STATISTIK_TABLES } from "@/lib/data/statistik-tables";
import { STATUS_KEGIATAN_OPTIONS, type TableConfig } from "@/lib/data/types";

export const masterKabinet: TableConfig = {
  slug: "master-kabinet",
  table: "master_kabinet",
  label: "Master Kabinet",
  description: "Data induk kabinet BEM UNDIP. Wajib diisi pertama karena jadi acuan tabel lain.",
  idColumn: "id_kabinet",
  optionLabelColumn: "nama_kabinet",
  fields: [
    { name: "nama_kabinet", label: "Nama Kabinet", type: "text", required: true },
    { name: "tahun_periode", label: "Tahun Periode", type: "text", required: true, placeholder: "mis. 2025/2026" },
    { name: "logo_kabinet", label: "Logo Kabinet", type: "file", required: false },
    { name: "deskripsi_kabinet", label: "Deskripsi", type: "textarea", required: false, colSpan: 2 },
    { name: "visi_kabinet", label: "Visi", type: "textarea", required: false, colSpan: 2 },
    { name: "misi_kabinet", label: "Misi", type: "textarea", required: false, colSpan: 2 }
  ]
};

export const mediaSosial: TableConfig = {
  slug: "media-sosial",
  table: "media_sosial",
  label: "Media Sosial",
  idColumn: "id_sosmed",
  fields: [
    { name: "id_kabinet", label: "Kabinet", type: "fk-select", required: true, fkTable: "master-kabinet" },
    { name: "platform", label: "Platform", type: "text", required: true, placeholder: "mis. Instagram" },
    { name: "username", label: "Username", type: "text", required: false },
    { name: "link_media_sosial", label: "Link", type: "text", required: true, colSpan: 2 },
    { name: "icon_media_sosial", label: "Ikon", type: "file", required: false }
  ]
};

export const layanan: TableConfig = {
  slug: "layanan",
  table: "layanan",
  label: "Layanan",
  idColumn: "id_layanan",
  fields: [
    { name: "id_kabinet", label: "Kabinet", type: "fk-select", required: true, fkTable: "master-kabinet" },
    { name: "nama_layanan", label: "Nama Layanan", type: "text", required: true },
    { name: "icon_layanan", label: "Ikon", type: "file", required: false },
    { name: "deskripsi_layanan", label: "Deskripsi", type: "textarea", required: false, colSpan: 2 },
    { name: "link_layanan", label: "Link Layanan", type: "text", required: false },
    { name: "urutan_tampil", label: "Urutan Tampil", type: "number", required: true, defaultValue: 0 }
  ]
};

export const agenda: TableConfig = {
  slug: "agenda",
  table: "agenda",
  label: "Agenda",
  description: "Kelola jadwal program kerja, lokakarya, dan agenda kegiatan mahasiswa BEM UNDIP.",
  idColumn: "id_agenda",
  fields: [
    { name: "id_bidang", label: "Bidang Pelaksana", type: "fk-select", required: true, fkTable: "bidang" },
    { name: "judul_agenda", label: "Judul Agenda", type: "text", required: true, colSpan: 2 },
    { name: "deskripsi_program", label: "Deskripsi", type: "textarea", required: false, colSpan: 2 },
    { name: "timeline_agenda", label: "Timeline", type: "text", required: false, placeholder: "mis. 12-15 Agustus 2026" },
    { name: "lokasi", label: "Lokasi", type: "text", required: false },
    { name: "poster_agenda", label: "Poster Agenda", type: "file", required: false },
    { name: "link_pendaftaran", label: "Link Pendaftaran", type: "text", required: false, placeholder: "https://forms.gle/..." },
    {
      name: "status_agenda",
      label: "Status",
      type: "select-enum",
      required: true,
      enumOptions: STATUS_KEGIATAN_OPTIONS,
      defaultValue: "akan_datang"
    }
  ]
};

export const programUnggulan: TableConfig = {
  slug: "program-unggulan",
  table: "program_unggulan",
  label: "Program Unggulan",
  idColumn: "id_program",
  fields: [
    { name: "id_kabinet", label: "Kabinet", type: "fk-select", required: true, fkTable: "master-kabinet" },
    { name: "nama_program", label: "Nama Program", type: "text", required: true, colSpan: 2 },
    { name: "deskripsi_program", label: "Deskripsi", type: "textarea", required: false, colSpan: 2 },
    { name: "gambar_program", label: "Gambar Program", type: "file", required: false },
    { name: "tanggal_waktu_program", label: "Tanggal & Waktu", type: "datetime", required: false },
    {
      name: "status_program",
      label: "Status",
      type: "select-enum",
      required: true,
      enumOptions: STATUS_KEGIATAN_OPTIONS,
      defaultValue: "akan_datang"
    }
  ]
};

export const bidang: TableConfig = {
  slug: "bidang",
  table: "bidang",
  label: "Bidang",
  description: "Data bidang/departemen kabinet BEM UNDIP.",
  idColumn: "id",
  optionLabelColumn: "nama_bidang",
  fields: [
    { name: "nama_bidang", label: "Nama Bidang", type: "text", required: true },
    { name: "gambar", label: "Logo Bidang", type: "file", required: false },
    { name: "penanggung_jawab", label: "Penanggung Jawab", type: "text", required: true },
    { name: "jumlah_anggota", label: "Jumlah Anggota", type: "number", required: true, defaultValue: 0 },
    { name: "deskripsi", label: "Deskripsi", type: "textarea", required: false, colSpan: 2 }
  ]
};

export const publikasi: TableConfig = {
  slug: "publikasi",
  table: "publikasi_terkini",
  label: "Publikasi",
  description: "Berita dan publikasi kabinet — tampil di halaman depan (max 6 terbaru).",
  idColumn: "id_publikasi",
  fields: [
    { name: "judul_publikasi", label: "Judul", type: "text", required: true, colSpan: 2 },
    { name: "kategori_publikasi", label: "Kategori", type: "text", required: false, placeholder: "mis. Berita, Pengumuman, Event" },
    { name: "gambar_publikasi", label: "Gambar", type: "file", required: false },
    { name: "tanggal_publikasi", label: "Tanggal", type: "datetime", required: false },
    { name: "isi_publikasi", label: "Isi Berita", type: "textarea", required: true, colSpan: 2 }
  ]
};

export const TABLES: Record<string, TableConfig> = {
  [masterKabinet.slug]: masterKabinet,
  [mediaSosial.slug]: mediaSosial,
  [layanan.slug]: layanan,
  [agenda.slug]: agenda,
  [programUnggulan.slug]: programUnggulan,
  [bidang.slug]: bidang,
  [publikasi.slug]: publikasi,
  ...Object.fromEntries(STATISTIK_TABLES.map((config) => [config.slug, config]))
};

export { STATISTIK_TABLES };
