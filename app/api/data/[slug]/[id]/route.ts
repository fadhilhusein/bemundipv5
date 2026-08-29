import { type NextRequest, NextResponse } from "next/server";
import client from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { ensureSchema } from "@/lib/data/schema";
import { TABLES } from "@/lib/data/tables";
import { validateFields } from "@/lib/data/validate";
import { ensurePenulis } from "@/lib/publikasi";

type RouteContext = { params: Promise<{ slug: string; id: string }> };

async function guardMaster() {
  const session = await requireSession();
  if (!session) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  if (session.role !== "master") return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  return { session };
}

async function guardForSlug(slug: string) {
  const config = TABLES[slug];
  // publikasi can be managed by any admin (like bidang), others need master for edit/delete
  const isPublicKonten = config?.table === "publikasi_terkini";
  if (isPublicKonten) {
    const session = await requireSession();
    if (!session) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
    return { session };
  }
  return guardMaster();
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { slug, id } = await params;
  const guard = await guardForSlug(slug);
  if (guard.error) return guard.error;

  const config = TABLES[slug];
  if (!config) {
    return NextResponse.json({ error: "Tabel tidak ditemukan" }, { status: 404 });
  }

  const numericId = Number(id);
  if (!Number.isFinite(numericId)) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  await ensureSchema();
  const body = await request.json().catch(() => ({}));
  const { columns, values, errors } = validateFields(config, body);

  if (config.table === "publikasi_terkini") {
    const penulisId = await ensurePenulis(guard.session.email ?? "");
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

  const setClause = columns.map((c, i) => `${c} = $${i + 1}`).join(", ");
  const sql = `UPDATE ${config.table} SET ${setClause} WHERE ${config.idColumn} = $${columns.length + 1} RETURNING *`;
  const result = await client.query(sql, [...values, numericId]);

  if (result.length === 0) {
    return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ data: result[0] });
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const { slug, id } = await params;
  const guard = await guardForSlug(slug);
  if (guard.error) return guard.error;

  const config = TABLES[slug];
  if (!config) {
    return NextResponse.json({ error: "Tabel tidak ditemukan" }, { status: 404 });
  }

  const numericId = Number(id);
  if (!Number.isFinite(numericId)) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  await ensureSchema();
  const result = await client.query(
    `DELETE FROM ${config.table} WHERE ${config.idColumn} = $1 RETURNING *`,
    [numericId]
  );

  if (result.length === 0) {
    return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ data: result[0] });
}
