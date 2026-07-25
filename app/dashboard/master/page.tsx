import Link from "next/link";
import { agenda, bidang, layanan, masterKabinet, mediaSosial, programUnggulan, STATISTIK_TABLES } from "@/lib/data/tables";
import type { TableConfig } from "@/lib/data/types";

const MAIN_TABLES: TableConfig[] = [masterKabinet, mediaSosial, layanan, agenda, programUnggulan, bidang];

function Section({ title, tables }: { title: string; tables: TableConfig[] }) {
  return (
    <div className="rounded-2xl border border-divider bg-white p-6 shadow-card sm:p-8">
      <h2 className="font-display text-2xl font-medium text-brown">{title}</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tables.map((table) => (
          <Link
            key={table.slug}
            href={`/dashboard/master/${table.slug}`}
            className="rounded-xl border border-divider p-5 transition hover:border-orange hover:shadow-card"
          >
            <p className="font-semibold text-brown">{table.label}</p>
            {table.description ? <p className="mt-1 text-xs text-clay">{table.description}</p> : null}
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
        <h1 className="font-display text-3xl font-medium text-brown">Menu Master</h1>
        <p className="mt-1 text-sm text-clay">
          Kelola (edit &amp; hapus) seluruh data yang tersimpan di sistem. Hanya admin master yang bisa mengakses
          halaman ini.
        </p>
      </div>
      <Section title="Data Utama" tables={MAIN_TABLES} />
      <Section title="Data Statistik" tables={STATISTIK_TABLES} />
    </div>
  );
}
