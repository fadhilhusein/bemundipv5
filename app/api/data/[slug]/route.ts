import { type NextRequest, NextResponse } from "next/server";
import client from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { ensureSchema } from "@/lib/data/schema";
import { TABLES } from "@/lib/data/tables";
import type { FieldConfig } from "@/lib/data/types";

type RouteContext = { params: Promise<{ slug: string }> };

function coerceValue(field: FieldConfig, raw: unknown): { value?: unknown; error?: string } {
  const isEmpty = raw === undefined || raw === null || raw === "";

  if (isEmpty) {
    if (field.required) return { error: `${field.label} wajib diisi` };
    return { value: null };
  }

  if (field.type === "number") {
    const num = Number(raw);
    if (!Number.isFinite(num)) return { error: `${field.label} harus berupa angka` };
    return { value: num };
  }

  if (field.type === "fk-select") {
    const num = Number(raw);
    if (!Number.isFinite(num)) return { error: `${field.label} tidak valid` };
    return { value: num };
  }

  if (field.type === "select-enum") {
    if (!field.enumOptions?.includes(String(raw))) {
      return { error: `${field.label} tidak valid` };
    }
    return { value: String(raw) };
  }

  return { value: String(raw) };
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  if (!(await requireSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const config = TABLES[slug];
  if (!config) {
    return NextResponse.json({ error: "Tabel tidak ditemukan" }, { status: 404 });
  }

  await ensureSchema();
  const rows = await client.query(
    `SELECT * FROM ${config.table} ORDER BY ${config.idColumn} DESC`
  );
  return NextResponse.json({ data: rows });
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  if (!(await requireSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const config = TABLES[slug];
  if (!config) {
    return NextResponse.json({ error: "Tabel tidak ditemukan" }, { status: 404 });
  }

  await ensureSchema();
  const body = await request.json().catch(() => ({}));

  const values: unknown[] = [];
  const errors: Record<string, string> = {};

  for (const field of config.fields) {
    const raw = body[field.name] ?? field.defaultValue;
    const { value, error } = coerceValue(field, raw);
    if (error) {
      errors[field.name] = error;
    } else {
      values.push(value);
    }
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Ada field yang belum valid", fields: errors }, { status: 400 });
  }

  const columns = config.fields.map((f) => f.name);
  const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ");
  const sql = `INSERT INTO ${config.table} (${columns.join(", ")}) VALUES (${placeholders}) RETURNING *`;
  const result = await client.query(sql, values);
  const row = result[0];

  return NextResponse.json({ data: row }, { status: 201 });
}
