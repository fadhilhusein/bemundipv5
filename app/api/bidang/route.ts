import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import client from "@/lib/db";
import { isAdminEmail } from "@/lib/admins";
import { ensureBidangTable } from "@/lib/bidang";
import { getAdminAuth } from "@/lib/firebase/admin";

async function requireSession() {
  const sessionCookie = (await cookies()).get("session")?.value;
  if (!sessionCookie) return null;

  try {
    const decoded = await getAdminAuth().verifySessionCookie(sessionCookie);
    if (!(await isAdminEmail(decoded.email))) return null;
    return decoded;
  } catch {
    return null;
  }
}

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
