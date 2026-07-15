import { type NextRequest, NextResponse } from "next/server";
import client from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { ensureSchema } from "@/lib/data/schema";
import { TABLES } from "@/lib/data/tables";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_request: NextRequest, { params }: RouteContext) {
  if (!(await requireSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const config = TABLES[slug];
  if (!config || !config.optionLabelColumn) {
    return NextResponse.json({ error: "Tabel tidak ditemukan" }, { status: 404 });
  }

  await ensureSchema();
  const result = await client.query(
    `SELECT ${config.idColumn} AS value, ${config.optionLabelColumn} AS label FROM ${config.table} ORDER BY ${config.idColumn} DESC`
  );

  return NextResponse.json({ data: result });
}
