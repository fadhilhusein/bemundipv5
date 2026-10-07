import Link from "next/link";
import { agenda, bidang, layanan, masterKabinet, mediaSosial, programUnggulan, publikasi, STATISTIK_TABLES } from "@/lib/data/tables";
import type { TableConfig } from "@/lib/data/types";

const MAIN_TABLES: TableConfig[] = [masterKabinet, mediaSosial, layanan, agenda, programUnggulan, bidang, publikasi];

function Section({ title, tables }: { title: string; tables: TableConfig[] }) {
  return (
    <div className="admin-panel">
      <h2 className="text-2xl font-semibold text-ink">{title}</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tables.map((table) => (
          <Link
            key={table.slug}
            href={`/dashboard/master/${table.slug}`}
            className="rounded-xl border border-line p-5 transition hover:border-orange hover:bg-surface"
          >
            <p className="font-semibold text-ink">{table.label}</p>
            {table.description ? <p className="mt-1 text-[13px] admin-muted">{table.description}</p> : null}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function MasterIndexPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>

        <p className="mt-1 text-sm admin-muted">
          Kelola (edit &amp; hapus) seluruh data yang tersimpan di sistem. Hanya admin master yang bisa mengakses
          halaman ini.
        </p>
      </div>
      <Section title="Data Utama" tables={MAIN_TABLES} />
      <Section title="Data Statistik" tables={STATISTIK_TABLES} />
    </div>
  );
}
