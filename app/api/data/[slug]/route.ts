import { type NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import client from "@/lib/db";
import { requireStaffSession } from "@/lib/auth";
import { TABLES } from "@/lib/data/tables";
import { validateFields } from "@/lib/data/validate";
import { ensurePenulis } from "@/lib/publikasi";

type RouteContext = { params: Promise<{ slug: string }> };

function revalidatePublicCache(slug: string) {
  if (slug === "agenda") {
    revalidateTag("agenda");
    revalidatePath("/");
    revalidatePath("/agenda");
  } else if (slug === "publikasi") {
    revalidateTag("publikasi");
    revalidatePath("/");
    revalidatePath("/publikasi");
  } else if (slug === "bidang") {
    revalidateTag("bidang");
    revalidatePath("/");
  } else if (slug === "program-unggulan") {
    revalidateTag("bidang");
    revalidatePath("/");
  }
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  if (!(await requireStaffSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const config = TABLES[slug];
  if (!config) {
    return NextResponse.json({ error: "Tabel tidak ditemukan" }, { status: 404 });
  }

  const rows = await client.query(
    `SELECT * FROM ${config.table} ORDER BY ${config.idColumn} DESC`
  );
  return NextResponse.json({ data: rows });
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  const session = await requireStaffSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const config = TABLES[slug];
  if (!config) {
    return NextResponse.json({ error: "Tabel tidak ditemukan" }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));

  const { columns, values, errors } = validateFields(config, body);

  // publikasi_terkini needs id_penulis from current admin
  if (config.table === "publikasi_terkini") {
    const penulisId = await ensurePenulis(session.email ?? "");
    columns.push("id_penulis");
    values.push(penulisId);
    const tanggalIdx = columns.indexOf("tanggal_publikasi");
    if (tanggalIdx !== -1 && values[tanggalIdx] === null) {
      columns.splice(tanggalIdx, 1);
      values.splice(tanggalIdx, 1);
    }
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Ada field yang belum valid", fields: errors }, { status: 400 });
  }

  const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ");
  const sql = `INSERT INTO ${config.table} (${columns.join(", ")}) VALUES (${placeholders}) RETURNING *`;
  const result = await client.query(sql, values);
  const row = result[0];

  revalidatePublicCache(slug);

  return NextResponse.json({ data: row }, { status: 201 });
}
