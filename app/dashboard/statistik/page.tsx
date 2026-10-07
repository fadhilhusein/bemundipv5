"use client";

import { useState } from "react";
import { DataForm } from "@/components/dashboard/DataForm";
import { STATISTIK_TABLES, TABLES } from "@/lib/data/tables";

export default function StatistikPage() {
  const [selectedSlug, setSelectedSlug] = useState(STATISTIK_TABLES[0].slug);
  const config = TABLES[selectedSlug];

  return (
    <div className="flex flex-col gap-8">
      <div className="admin-panel">
        <h2 className="text-2xl font-semibold text-ink">Jenis Statistik</h2>
        <p className="mt-1 text-sm admin-muted">
          Pilih struktur organisasi yang ingin diisi datanya.
        </p>

        <label htmlFor="statistik-type" className="mt-5 block font-medium">Jenis struktur organisasi</label>
        <select
          id="statistik-type"
          value={selectedSlug}
          onChange={(e) => setSelectedSlug(e.target.value)}
          className="admin-input mt-2 max-w-full sm:max-w-96"
        >
          {STATISTIK_TABLES.map((table) => (
            <option key={table.slug} value={table.slug}>
              {table.label}
            </option>
          ))}
        </select>
      </div>

      <DataForm key={config.slug} config={config} />
    </div>
  );
}
