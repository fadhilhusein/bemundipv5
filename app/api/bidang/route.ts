import { type NextRequest, NextResponse } from "next/server";
import client from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { ensureBidangTable } from "@/lib/bidang";

export async function GET() {
  if (!(await requireSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureBidangTable();
  const rows = await client`SELECT * FROM bidang ORDER BY created_at DESC`;
  return NextResponse.json({ data: rows });
}

export async function POST(request: NextRequest) {
  if (!(await requireSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureBidangTable();
  const { namaBidang, deskripsi, penanggungJawab, jumlahAnggota } = await request.json();

  if (!namaBidang || !deskripsi || !penanggungJawab || !jumlahAnggota) {
    return NextResponse.json({ error: "Semua field wajib diisi" }, { status: 400 });
  }

  const [row] = await client`
    INSERT INTO bidang (nama_bidang, deskripsi, penanggung_jawab, jumlah_anggota)
    VALUES (${namaBidang}, ${deskripsi}, ${penanggungJawab}, ${Number(jumlahAnggota)})
    RETURNING *
  `;

  return NextResponse.json({ data: row }, { status: 201 });
}
