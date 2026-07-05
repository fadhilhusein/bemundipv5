"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

type Bidang = {
  id: number;
  nama_bidang: string;
  deskripsi: string;
  penanggung_jawab: string;
  jumlah_anggota: number;
  created_at: string;
};

const emptyForm = {
  namaBidang: "",
  deskripsi: "",
  penanggungJawab: "",
  jumlahAnggota: ""
};

export default function DashboardPage() {
  const [form, setForm] = useState(emptyForm);
  const [entries, setEntries] = useState<Bidang[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEntries = async () => {
    setIsLoading(true);
    const res = await fetch("/api/bidang");
    const json = await res.json();
    setEntries(json.data ?? []);
    setIsLoading(false);
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/bidang", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error ?? "Gagal menyimpan data");
      }

      setForm(emptyForm);
      await loadEntries();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan data");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-2xl border border-divider bg-white p-6 shadow-card sm:p-8">
        <h2 className="font-display text-2xl font-medium text-brown">Tambah Bidang</h2>
        <p className="mt-1 text-sm text-clay">
          Catat data bidang/departemen kabinet BEM UNDIP 2026.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <label htmlFor="namaBidang" className="text-sm font-semibold text-brown">
              Nama Bidang
            </label>
            <input
              id="namaBidang"
              required
              value={form.namaBidang}
              onChange={(e) => setForm({ ...form, namaBidang: e.target.value })}
              className="mt-2 h-12 w-full rounded-full border border-divider bg-white px-5 text-sm text-brown outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
              placeholder="mis. Departemen Sosial Politik"
            />
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="penanggungJawab" className="text-sm font-semibold text-brown">
              Penanggung Jawab (Ketua Bidang)
            </label>
            <input
              id="penanggungJawab"
              required
              value={form.penanggungJawab}
              onChange={(e) => setForm({ ...form, penanggungJawab: e.target.value })}
              className="mt-2 h-12 w-full rounded-full border border-divider bg-white px-5 text-sm text-brown outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
              placeholder="Nama ketua bidang"
            />
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="jumlahAnggota" className="text-sm font-semibold text-brown">
              Jumlah Anggota
            </label>
            <input
              id="jumlahAnggota"
              type="number"
              min={0}
              required
              value={form.jumlahAnggota}
              onChange={(e) => setForm({ ...form, jumlahAnggota: e.target.value })}
              className="mt-2 h-12 w-full rounded-full border border-divider bg-white px-5 text-sm text-brown outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
              placeholder="mis. 12"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="deskripsi" className="text-sm font-semibold text-brown">
              Deskripsi
            </label>
            <textarea
              id="deskripsi"
              required
              rows={3}
              value={form.deskripsi}
              onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
              className="mt-2 w-full rounded-2xl border border-divider bg-white px-5 py-3 text-sm text-brown outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
              placeholder="Ringkasan tugas dan ruang lingkup bidang"
            />
          </div>

          {error ? (
            <p role="alert" className="text-sm text-red sm:col-span-2">
              {error}
            </p>
          ) : null}

          <div className="sm:col-span-2">
            <Button className="px-8" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan…" : "Simpan Bidang"}
            </Button>
          </div>
        </form>
      </div>

      <div className="rounded-2xl border border-divider bg-white p-6 shadow-card sm:p-8">
        <h2 className="font-display text-2xl font-medium text-brown">Daftar Bidang</h2>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-divider text-xs font-semibold uppercase tracking-wide text-clay">
                <th className="py-3 pr-4">Nama Bidang</th>
                <th className="py-3 pr-4">Penanggung Jawab</th>
                <th className="py-3 pr-4">Jumlah Anggota</th>
                <th className="py-3 pr-4">Deskripsi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-clay">
                    Memuat data…
                  </td>
                </tr>
              ) : entries.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-clay">
                    Belum ada data bidang.
                  </td>
                </tr>
              ) : (
                entries.map((entry) => (
                  <tr key={entry.id} className="border-b border-divider last:border-0">
                    <td className="py-3 pr-4 font-semibold text-brown">
                      {entry.nama_bidang}
                    </td>
                    <td className="py-3 pr-4 text-brown/90">{entry.penanggung_jawab}</td>
                    <td className="py-3 pr-4 text-brown/90">{entry.jumlah_anggota}</td>
                    <td className="py-3 pr-4 max-w-sm text-brown/70">{entry.deskripsi}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
