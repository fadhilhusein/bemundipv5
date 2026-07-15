import type { FieldConfig, TableConfig } from "@/lib/data/types";

const kabinetField: FieldConfig = {
  name: "id_kabinet",
  label: "Kabinet",
  type: "fk-select",
  required: true,
  fkTable: "master-kabinet"
};

function koorbidConfig(slug: string, table: string, label: string): TableConfig {
  return {
    slug,
    table,
    label,
    idColumn: "id_statistik",
    fields: [
      kabinetField,
      { name: "nama_koordinator_bidang", label: "Nama Koordinator Bidang", type: "text", required: true, colSpan: 2 },
      { name: "bidang_yang_dinaungi", label: "Bidang yang Dinaungi", type: "text", required: false, colSpan: 2 }
    ]
  };
}

function bidangConfig(slug: string, table: string, label: string): TableConfig {
  return {
    slug,
    table,
    label,
    idColumn: "id_statistik",
    fields: [
      kabinetField,
      { name: "nama_koordinator_bidang", label: "Nama Koordinator Bidang", type: "text", required: true },
      { name: "nama_ketua_bidang", label: "Nama Ketua Bidang", type: "text", required: false },
      { name: "jumlah_fungsionaris", label: "Jumlah Fungsionaris", type: "number", required: true, defaultValue: 0 },
      { name: "jumlah_divisi", label: "Jumlah Divisi", type: "number", required: true, defaultValue: 0 },
      { name: "nama_divisi", label: "Nama Divisi", type: "text", required: false }
    ]
  };
}

const statistikKabinet: TableConfig = {
  slug: "statistik-kabinet",
  table: "statistik_kabinet",
  label: "Statistik — Kabinet",
  idColumn: "id_statistik",
  fields: [
    kabinetField,
    { name: "jumlah_fungsionaris", label: "Jumlah Fungsionaris", type: "number", required: true, defaultValue: 0 },
    { name: "jumlah_bidang_biro_kantor", label: "Jumlah Bidang/Biro/Kantor", type: "number", required: true, defaultValue: 0 },
    { name: "periode", label: "Periode", type: "text", required: false, placeholder: "mis. 2025/2026" }
  ]
};

const statistikDewanPimpinan: TableConfig = {
  slug: "statistik-dewan-pimpinan",
  table: "statistik_dewan_pimpinan",
  label: "Statistik — Dewan Pimpinan",
  idColumn: "id_statistik",
  fields: [
    kabinetField,
    { name: "nama_ketua_bem", label: "Nama Ketua BEM", type: "text", required: true, colSpan: 2 },
    { name: "nama_wakil_ketua_bem", label: "Nama Wakil Ketua BEM", type: "text", required: false, colSpan: 2 },
    { name: "nama_sekretaris_kabinet", label: "Nama Sekretaris Kabinet", type: "text", required: false, colSpan: 2 }
  ]
};

const statistikKoordinator: TableConfig = {
  slug: "statistik-koordinator",
  table: "statistik_koordinator",
  label: "Statistik — Koordinator",
  idColumn: "id_statistik",
  fields: [
    kabinetField,
    { name: "nama_koordinator", label: "Nama Koordinator", type: "text", required: true, colSpan: 2 },
    { name: "keterangan", label: "Keterangan", type: "text", required: false, colSpan: 2 }
  ]
};

const statistikKoordinatorWilayah: TableConfig = {
  slug: "statistik-koordinator-wilayah",
  table: "statistik_koordinator_wilayah",
  label: "Statistik — Koordinator Wilayah",
  idColumn: "id_statistik",
  fields: [
    kabinetField,
    { name: "nama_koordinator_wilayah", label: "Nama Koordinator Wilayah", type: "text", required: true, colSpan: 2 }
  ]
};

const statistikInspektoratPenjaminMutu: TableConfig = {
  slug: "statistik-inspektorat-penjamin-mutu",
  table: "statistik_inspektorat_penjamin_mutu",
  label: "Statistik — Inspektorat Penjamin Mutu",
  idColumn: "id_statistik",
  fields: [
    kabinetField,
    { name: "jumlah_fungsionaris", label: "Jumlah Fungsionaris", type: "number", required: true, defaultValue: 0 },
    { name: "nama_ketua_unit", label: "Nama Ketua Unit", type: "text", required: false },
    { name: "nama_divisi", label: "Nama Divisi", type: "text", required: false }
  ]
};

const statistikBiroKesekretariatan: TableConfig = {
  slug: "statistik-biro-kesekretariatan",
  table: "statistik_biro_kesekretariatan",
  label: "Statistik — Biro Kesekretariatan",
  idColumn: "id_statistik",
  fields: [
    kabinetField,
    { name: "nama_ketua_biro", label: "Nama Ketua Biro", type: "text", required: true },
    { name: "jumlah_fungsionaris", label: "Jumlah Fungsionaris", type: "number", required: true, defaultValue: 0 }
  ]
};

const statistikKmi: TableConfig = {
  slug: "statistik-kmi",
  table: "statistik_kmi",
  label: "Statistik — KMI (Kantor)",
  idColumn: "id_statistik",
  fields: [
    kabinetField,
    { name: "nama_ketua_kantor", label: "Nama Ketua Kantor", type: "text", required: true },
    { name: "jumlah_fungsionaris", label: "Jumlah Fungsionaris", type: "number", required: true, defaultValue: 0 },
    { name: "jumlah_divisi", label: "Jumlah Divisi", type: "number", required: true, defaultValue: 0 },
    { name: "nama_divisi", label: "Nama Divisi", type: "text", required: false }
  ]
};

const statistikBiroStatistik: TableConfig = {
  slug: "statistik-biro-statistik",
  table: "statistik_biro_statistik",
  label: "Statistik — Biro Statistik",
  idColumn: "id_statistik",
  fields: [
    kabinetField,
    { name: "jumlah_fungsionaris", label: "Jumlah Fungsionaris", type: "number", required: true, defaultValue: 0 },
    { name: "nama_ketua_biro", label: "Nama Ketua Biro", type: "text", required: true },
    { name: "jumlah_divisi", label: "Jumlah Divisi", type: "number", required: true, defaultValue: 0 },
    { name: "nama_divisi", label: "Nama Divisi", type: "text", required: false }
  ]
};

const statistikBiroKeuangan: TableConfig = {
  slug: "statistik-biro-keuangan",
  table: "statistik_biro_keuangan",
  label: "Statistik — Biro Keuangan",
  idColumn: "id_statistik",
  fields: [
    kabinetField,
    { name: "nama_ketua_biro", label: "Nama Ketua Biro", type: "text", required: true },
    { name: "jumlah_fungsionaris", label: "Jumlah Fungsionaris", type: "number", required: true, defaultValue: 0 }
  ]
};

const koorbidTables: TableConfig[] = [
  koorbidConfig("statistik-koorbid-prp", "statistik_koorbid_prp", "Statistik — Koorbid PRP"),
  koorbidConfig("statistik-koorbid-epm", "statistik_koorbid_epm", "Statistik — Koorbid EPM"),
  koorbidConfig("statistik-koorbid-mbk", "statistik_koorbid_mbk", "Statistik — Koorbid MBK"),
  koorbidConfig("statistik-koorbid-kemal", "statistik_koorbid_kemal", "Statistik — Koorbid KEMAL"),
  koorbidConfig("statistik-koorbid-dinkam", "statistik_koorbid_dinkam", "Statistik — Koorbid DINKAM")
];

const bidangTables: TableConfig[] = [
  bidangConfig("statistik-bidang-riset-keilmuan", "statistik_bidang_riset_keilmuan", "Statistik — Bidang Riset dan Keilmuan"),
  bidangConfig("statistik-bidang-sosial-politik", "statistik_bidang_sosial_politik", "Statistik — Bidang Sosial Politik"),
  bidangConfig("statistik-bidang-pemberdayaan-perempuan", "statistik_bidang_pemberdayaan_perempuan", "Statistik — Bidang Pemberdayaan Perempuan"),
  bidangConfig("statistik-bidang-kemitraan-eksternal", "statistik_bidang_kemitraan_eksternal", "Statistik — Bidang Kemitraan Eksternal"),
  bidangConfig("statistik-bidang-sosial-masyarakat", "statistik_bidang_sosial_masyarakat", "Statistik — Bidang Sosial Masyarakat"),
  bidangConfig("statistik-bidang-harmonisasi-kampus", "statistik_bidang_harmonisasi_kampus", "Statistik — Bidang Harmonisasi Kampus"),
  bidangConfig("statistik-bidang-kpsdm", "statistik_bidang_kpsdm", "Statistik — Bidang K&PSDM"),
  bidangConfig("statistik-bidang-lingkungan-hidup", "statistik_bidang_lingkungan_hidup", "Statistik — Bidang Lingkungan Hidup"),
  bidangConfig("statistik-bidang-ekonomi-kreatif", "statistik_bidang_ekonomi_kreatif", "Statistik — Bidang Ekonomi Kreatif"),
  bidangConfig("statistik-bidang-seni-olahraga", "statistik_bidang_seni_olahraga", "Statistik — Bidang Seni dan Olahraga"),
  bidangConfig("statistik-bidang-kesejahteraan-mahasiswa", "statistik_bidang_kesejahteraan_mahasiswa", "Statistik — Bidang Kesejahteraan Mahasiswa")
];

export const STATISTIK_TABLES: TableConfig[] = [
  statistikKabinet,
  statistikDewanPimpinan,
  statistikKoordinator,
  statistikKoordinatorWilayah,
  ...koorbidTables,
  statistikInspektoratPenjaminMutu,
  statistikBiroKesekretariatan,
  statistikKmi,
  statistikBiroStatistik,
  statistikBiroKeuangan,
  ...bidangTables
];
