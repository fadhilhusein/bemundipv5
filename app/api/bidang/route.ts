import { type NextRequest, NextResponse } from "next/server";
import client from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { ensureBidangTable } from "@/lib/bidang";

export async function GET() {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureBidangTable();

  if (session.role === "bidang") {
    const rows = await client`SELECT * FROM bidang WHERE id = ${session.bidangId} ORDER BY created_at DESC`;
    return NextResponse.json({ data: rows });
  }

  const rows = await client`SELECT * FROM bidang ORDER BY created_at DESC`;
  return NextResponse.json({ data: rows });
}

export async function POST(request: NextRequest) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.role === "bidang") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await ensureBidangTable();
  const { namaBidang, deskripsi, penanggungJawab, jumlahAnggota, gambar } = await request.json();

  if (!namaBidang || !deskripsi || !penanggungJawab || !jumlahAnggota) {
    return NextResponse.json({ error: "Semua field wajib diisi" }, { status: 400 });
  }

  const [row] = await client`
    INSERT INTO bidang (nama_bidang, deskripsi, penanggung_jawab, jumlah_anggota, gambar)
    VALUES (${namaBidang}, ${deskripsi}, ${penanggungJawab}, ${Number(jumlahAnggota)}, ${gambar ?? null})
    RETURNING *
  `;

  return NextResponse.json({ data: row }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureBidangTable();
  const { id, namaBidang, deskripsi, penanggungJawab, jumlahAnggota, gambar } = await request.json();

  const numericId = Number(id);
  if (!Number.isFinite(numericId)) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }
  if (session.role === "bidang" && numericId !== session.bidangId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!namaBidang || !deskripsi || !penanggungJawab || !jumlahAnggota) {
    return NextResponse.json({ error: "Semua field wajib diisi" }, { status: 400 });
  }

  const [row] = await client`
    UPDATE bidang
    SET nama_bidang = ${namaBidang},
        deskripsi = ${deskripsi},
        penanggung_jawab = ${penanggungJawab},
        jumlah_anggota = ${Number(jumlahAnggota)},
        gambar = ${gambar ?? null}
    WHERE id = ${numericId}
    RETURNING *
  `;

  if (!row) {
    return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ data: row });
}

export async function DELETE(request: NextRequest) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.role === "bidang") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await ensureBidangTable();
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  const [row] = await client`DELETE FROM bidang WHERE id = ${id} RETURNING *`;

  if (!row) {
    return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ data: row });
}
