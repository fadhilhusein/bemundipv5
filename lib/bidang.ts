import "server-only";

import client from "@/lib/db";

let bidangReady: Promise<void> | null = null;

export async function ensureBidangTable(): Promise<void> {
  if (bidangReady) return bidangReady;

  bidangReady = (async () => {
    await client`
      CREATE TABLE IF NOT EXISTS bidang (
        id SERIAL PRIMARY KEY,
        nama_bidang TEXT NOT NULL,
        deskripsi TEXT NOT NULL,
        penanggung_jawab TEXT NOT NULL,
        jumlah_anggota INTEGER NOT NULL,
        gambar TEXT,
        gambar_utama TEXT,
        quote_utama TEXT,
        quote_penutup TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `;
    await client`ALTER TABLE bidang ADD COLUMN IF NOT EXISTS gambar TEXT`;
    await client`ALTER TABLE bidang ADD COLUMN IF NOT EXISTS gambar_utama TEXT`;
    await client`ALTER TABLE bidang ADD COLUMN IF NOT EXISTS quote_utama TEXT`;
    await client`ALTER TABLE bidang ADD COLUMN IF NOT EXISTS quote_penutup TEXT`;
    await client`
      CREATE TABLE IF NOT EXISTS anggota_bidang (
        id SERIAL PRIMARY KEY,
        id_bidang INTEGER NOT NULL REFERENCES bidang(id) ON UPDATE CASCADE ON DELETE CASCADE,
        nama_anggota TEXT NOT NULL,
        jabatan TEXT,
        foto TEXT,
        urutan INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `;
    await client`CREATE INDEX IF NOT EXISTS idx_anggota_bidang ON anggota_bidang(id_bidang, urutan, id)`;
  })().catch((err) => {
    bidangReady = null;
    throw err;
  });

  return bidangReady;
}
