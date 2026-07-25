import { type NextRequest, NextResponse } from "next/server";
import client from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { ensureSchema } from "@/lib/data/schema";
import { TABLES } from "@/lib/data/tables";
import { validateFields } from "@/lib/data/validate";

type RouteContext = { params: Promise<{ slug: string; id: string }> };

async function guardMaster() {
  const session = await requireSession();
  if (!session) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  if (session.role !== "master") return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  return { session };
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const guard = await guardMaster();
  if (guard.error) return guard.error;

  const { slug, id } = await params;
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
  const guard = await guardMaster();
  if (guard.error) return guard.error;

  const { slug, id } = await params;
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
