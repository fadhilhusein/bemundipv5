"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Pencil, Plus, Sparkles, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

type Bidang = {
  id: number;
  nama_bidang: string;
  deskripsi: string;
  penanggung_jawab: string;
  jumlah_anggota: number;
  gambar: string | null;
  created_at: string;
};

type BidangManagerProps = {
  canManageAll: boolean;
};

const emptyForm = {
  namaBidang: "",
  deskripsi: "",
  penanggungJawab: "",
  jumlahAnggota: "",
  gambar: ""
};

export function BidangManager({ canManageAll }: BidangManagerProps) {
  const [form, setForm] = useState(emptyForm);
  const [entries, setEntries] = useState<Bidang[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 3000);
  };

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

  useEffect(() => {
    if (!isModalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", "bidang");
      const res = await fetch("/api/upload", { method: "POST", body });
      if (!res.ok) throw new Error("Upload gagal");
      const json = await res.json();
      setForm((prev) => ({ ...prev, gambar: json.url }));
    } catch {
      setError("Gagal mengunggah logo");
    } finally {
      setIsUploading(false);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
    setIsModalOpen(true);
  };

  const openEdit = (entry: Bidang) => {
    setEditingId(entry.id);
    setForm({
      namaBidang: entry.nama_bidang,
      deskripsi: entry.deskripsi,
      penanggungJawab: entry.penanggung_jawab,
      jumlahAnggota: String(entry.jumlah_anggota),
      gambar: entry.gambar ?? ""
    });
    setError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const payload = { ...form, ...(editingId ? { id: editingId } : {}) };
      const res = await fetch("/api/bidang", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error ?? "Gagal menyimpan data");
      }

      const actionLabel = editingId ? "diperbarui" : "ditambahkan";
      closeModal();
      await loadEntries();
      showToast(`Bidang berhasil ${actionLabel}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan data");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (entry: Bidang) => {
    if (!window.confirm(`Hapus bidang "${entry.nama_bidang}"?`)) return;
    setError(null);
    try {
      const res = await fetch(`/api/bidang?id=${entry.id}`, { method: "DELETE" });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error ?? "Gagal menghapus data");
      }
      if (editingId === entry.id) closeModal();
      await loadEntries();
      showToast(`Bidang "${entry.nama_bidang}" dihapus`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus data");
    }
  };

  const inputClass =
    "mt-2 h-12 w-full rounded-full border border-divider bg-white px-5 text-sm text-brown outline-none focus:border-orange focus:ring-2 focus:ring-orange/20";
  const textareaClass =
    "mt-2 w-full rounded-2xl border border-divider bg-white px-5 py-3 text-sm text-brown outline-none focus:border-orange focus:ring-2 focus:ring-orange/20";

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-2xl border border-divider bg-white p-6 shadow-card sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-medium text-brown">
              {canManageAll ? "Daftar Bidang" : "Profil Bidang Saya"}
            </h2>
            <p className="mt-1 text-sm text-clay">
              {canManageAll
                ? "Kelola data bidang/departemen kabinet BEM UNDIP 2026."
                : "Kelola data profil bidang/biro milik Anda."}
            </p>
          </div>
          {canManageAll ? (
            <Button type="button" onClick={openCreate} className="px-5">
              <Plus size={16} />
              Tambah Bidang
            </Button>
          ) : null}
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-divider text-xs font-semibold uppercase tracking-wide text-clay">
                <th className="py-3 pr-4">Logo</th>
                <th className="py-3 pr-4">Nama Bidang</th>
                <th className="py-3 pr-4">Penanggung Jawab</th>
                <th className="py-3 pr-4">Jumlah Anggota</th>
                <th className="py-3 pr-4">Deskripsi</th>
                <th className="py-3 pr-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-clay">
                    Memuat data…
                  </td>
                </tr>
              ) : entries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-clay">
                    Belum ada data bidang.
                  </td>
                </tr>
              ) : (
                entries.map((entry) => (
                  <tr key={entry.id} className="border-b border-divider last:border-0">
                    <td className="py-3 pr-4">
                      {entry.gambar ? (
                        <Image src={entry.gambar} alt="" width={40} height={40} className="h-10 w-10 rounded-lg object-cover" />
                      ) : (
                        <span className="text-brown/40">—</span>
                      )}
                    </td>
                    <td className="py-3 pr-4 font-semibold text-brown">{entry.nama_bidang}</td>
                    <td className="py-3 pr-4 text-brown/90">{entry.penanggung_jawab}</td>
                    <td className="py-3 pr-4 text-brown/90">{entry.jumlah_anggota}</td>
                    <td className="py-3 pr-4 max-w-sm text-brown/70">{entry.deskripsi}</td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <Link
                          href="/dashboard/program-unggulan"
                          aria-label={`Program Unggulan ${entry.nama_bidang}`}
                          title="Kelola Program Unggulan"
                          className="text-clay hover:text-orange"
                        >
                          <Sparkles size={16} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => openEdit(entry)}
                          aria-label={`Edit ${entry.nama_bidang}`}
                          className="text-clay hover:text-orange"
                        >
                          <Pencil size={16} />
                        </button>
                        {canManageAll ? (
                          <button
                            type="button"
                            onClick={() => handleDelete(entry)}
                            aria-label={`Hapus ${entry.nama_bidang}`}
                            className="text-clay hover:text-red"
                          >
                            <Trash2 size={16} />
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} aria-hidden="true" />
          <div
            role="dialog"
            aria-modal="true"
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-divider bg-white p-6 shadow-card sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-medium text-brown">
                  {editingId ? "Edit Bidang" : "Tambah Bidang"}
                </h2>
                <p className="mt-1 text-sm text-clay">
                  Catat data bidang/departemen kabinet BEM UNDIP 2026.
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Tutup"
                className="text-clay transition hover:text-brown"
              >
                <X size={20} />
              </button>
            </div>

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
                  className={inputClass}
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
                  className={inputClass}
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
                  className={inputClass}
                  placeholder="mis. 12"
                />
              </div>

              <div className="sm:col-span-1">
                <label htmlFor="gambar" className="text-sm font-semibold text-brown">
                  Logo Bidang
                </label>
                <input
                  id="gambar"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={handleFileChange}
                  className="mt-2 block w-full text-sm text-brown file:mr-4 file:rounded-full file:border-0 file:bg-orange file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                />
                {isUploading ? <p className="mt-1 text-xs text-clay">Mengunggah…</p> : null}
                {form.gambar ? (
                  <Image src={form.gambar} alt="" width={80} height={80} className="mt-2 h-20 w-20 rounded-xl object-cover" />
                ) : null}
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
                  className={textareaClass}
                  placeholder="Ringkasan tugas dan ruang lingkup bidang"
                />
              </div>

              {error ? (
                <p role="alert" className="text-sm text-red sm:col-span-2">
                  {error}
                </p>
              ) : null}

              <div className="flex items-center gap-3 sm:col-span-2">
                <Button className="px-8" disabled={isSubmitting || isUploading}>
                  {isSubmitting ? "Menyimpan…" : editingId ? "Simpan Perubahan" : "Simpan Bidang"}
                </Button>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="text-sm font-semibold text-clay hover:text-brown"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div className="fixed bottom-6 right-6 z-50 rounded-full bg-brown px-5 py-3 text-sm font-semibold text-white shadow-card">
          {toast}
        </div>
      ) : null}
    </div>
  );
}
