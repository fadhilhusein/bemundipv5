"use client";

import { useState } from "react";
import { DataForm } from "@/components/dashboard/DataForm";
import { STATISTIK_TABLES, TABLES } from "@/lib/data/tables";

export default function StatistikPage() {
  const [selectedSlug, setSelectedSlug] = useState(STATISTIK_TABLES[0].slug);
  const config = TABLES[selectedSlug];

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-2xl border border-divider bg-white p-6 shadow-card sm:p-8">
        <h2 className="font-display text-2xl font-medium text-brown">Jenis Statistik</h2>
        <p className="mt-1 text-sm text-clay">
          Pilih struktur organisasi yang ingin diisi datanya.
        </p>

        <select
          value={selectedSlug}
          onChange={(e) => setSelectedSlug(e.target.value)}
          className="mt-4 h-12 w-full rounded-full border border-divider bg-white px-5 text-sm text-brown outline-none focus:border-orange focus:ring-2 focus:ring-orange/20 sm:w-96"
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
