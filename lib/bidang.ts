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
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `;
    await client`ALTER TABLE bidang ADD COLUMN IF NOT EXISTS gambar TEXT`;
  })().catch((err) => {
    bidangReady = null;
    throw err;
  });

  return bidangReady;
}
