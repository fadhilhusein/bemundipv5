import "server-only";

import client from "@/lib/db";

export async function ensureBidangTable() {
  await client`
    CREATE TABLE IF NOT EXISTS bidang (
      id SERIAL PRIMARY KEY,
      nama_bidang TEXT NOT NULL,
      deskripsi TEXT NOT NULL,
      penanggung_jawab TEXT NOT NULL,
      jumlah_anggota INTEGER NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
}
