import { type NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import client from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { ensureBidangTable } from "@/lib/bidang";

type AnggotaInput = {
  namaAnggota?: unknown;
  jabatan?: unknown;
  foto?: unknown;
};

function normalizeAnggota(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => item as AnggotaInput)
    .map((item) => ({
      namaAnggota: String(item.namaAnggota ?? "").trim(),
      jabatan: String(item.jabatan ?? "").trim(),
      foto: String(item.foto ?? "").trim()
    }))
    .filter((item) => item.namaAnggota)
    .slice(0, 200);
}

function parseJumlahAnggota(value: unknown): number | null {
  const number = Number(value);
  return Number.isInteger(number) && number >= 0 ? number : null;
}

async function insertAnggota(bidangId: number, anggota: ReturnType<typeof normalizeAnggota>) {
  for (let index = 0; index < anggota.length; index += 1) {
    const item = anggota[index];
    await client`
      INSERT INTO anggota_bidang (id_bidang, nama_anggota, jabatan, foto, urutan)
      VALUES (${bidangId}, ${item.namaAnggota}, ${item.jabatan || null}, ${item.foto || null}, ${index})
    `;
  }
}

function revalidateBidang(id?: number) {
  revalidateTag("bidang");
  revalidatePath("/");
  if (id) revalidatePath(`/bidang/${id}`);
}

export async function GET() {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await ensureBidangTable();
  const rows = session.role === "bidang"
    ? await client`
        SELECT b.*, COALESCE((
          SELECT json_agg(json_build_object(
            'id', a.id,
            'nama_anggota', a.nama_anggota,
            'jabatan', a.jabatan,
            'foto', a.foto,
            'urutan', a.urutan
          ) ORDER BY a.urutan, a.id)
          FROM anggota_bidang a
          WHERE a.id_bidang = b.id
        ), '[]'::json) AS anggota
        FROM bidang b
        WHERE b.id = ${session.bidangId}
        ORDER BY b.created_at DESC
      `
    : await client`
        SELECT b.*, COALESCE((
          SELECT json_agg(json_build_object(
            'id', a.id,
            'nama_anggota', a.nama_anggota,
            'jabatan', a.jabatan,
            'foto', a.foto,
            'urutan', a.urutan
          ) ORDER BY a.urutan, a.id)
          FROM anggota_bidang a
          WHERE a.id_bidang = b.id
        ), '[]'::json) AS anggota
        FROM bidang b
        ORDER BY b.created_at DESC
      `;

  return NextResponse.json({ data: rows });
}

export async function POST(request: NextRequest) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role === "bidang") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await ensureBidangTable();
  const body = await request.json();
  const { namaBidang, deskripsi, penanggungJawab, gambar, gambarUtama, quoteUtama, quotePenutup } = body;
  const anggota = normalizeAnggota(body.anggota);
  const jumlahAnggota = parseJumlahAnggota(body.jumlahAnggota);

  if (!String(namaBidang ?? "").trim() || !String(deskripsi ?? "").trim() || !String(penanggungJawab ?? "").trim() || jumlahAnggota === null) {
    return NextResponse.json({ error: "Nama, deskripsi, penanggung jawab, dan jumlah anggota wajib valid" }, { status: 400 });
  }

  const [row] = await client`
    INSERT INTO bidang (nama_bidang, deskripsi, penanggung_jawab, jumlah_anggota, gambar, gambar_utama, quote_utama, quote_penutup)
    VALUES (${String(namaBidang).trim()}, ${String(deskripsi).trim()}, ${String(penanggungJawab).trim()}, ${jumlahAnggota},
            ${gambar || null}, ${gambarUtama || null}, ${quoteUtama || null}, ${quotePenutup || null})
    RETURNING *
  `;

  await insertAnggota(Number(row.id), anggota);
  revalidateBidang(Number(row.id));
  return NextResponse.json({ data: { ...row, anggota } }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await ensureBidangTable();
  const body = await request.json();
  const { id, namaBidang, deskripsi, penanggungJawab, gambar, gambarUtama, quoteUtama, quotePenutup } = body;
  const numericId = Number(id);
  const anggota = normalizeAnggota(body.anggota);
  const jumlahAnggota = parseJumlahAnggota(body.jumlahAnggota);

  if (!Number.isInteger(numericId) || numericId <= 0) return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  if (session.role === "bidang" && numericId !== session.bidangId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!String(namaBidang ?? "").trim() || !String(deskripsi ?? "").trim() || !String(penanggungJawab ?? "").trim() || jumlahAnggota === null) {
    return NextResponse.json({ error: "Nama, deskripsi, penanggung jawab, dan jumlah anggota wajib valid" }, { status: 400 });
  }

  const [row] = await client`
    UPDATE bidang
    SET nama_bidang = ${String(namaBidang).trim()},
        deskripsi = ${String(deskripsi).trim()},
        penanggung_jawab = ${String(penanggungJawab).trim()},
        jumlah_anggota = ${jumlahAnggota},
        gambar = ${gambar || null},
        gambar_utama = ${gambarUtama || null},
        quote_utama = ${quoteUtama || null},
        quote_penutup = ${quotePenutup || null}
    WHERE id = ${numericId}
    RETURNING *
  `;

  if (!row) return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });

  await client`DELETE FROM anggota_bidang WHERE id_bidang = ${numericId}`;
  await insertAnggota(numericId, anggota);
  revalidateBidang(numericId);
  return NextResponse.json({ data: { ...row, anggota } });
}

export async function DELETE(request: NextRequest) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role === "bidang") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await ensureBidangTable();
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));
  if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });

  const [row] = await client`DELETE FROM bidang WHERE id = ${id} RETURNING *`;
  if (!row) return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });

  revalidateBidang(id);
  return NextResponse.json({ data: row });
}
