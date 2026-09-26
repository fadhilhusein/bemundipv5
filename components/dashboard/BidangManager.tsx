"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ImagePlus, Pencil, Plus, Sparkles, Trash2, UserPlus, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

type Bidang = {
  id: number;
  nama_bidang: string;
  deskripsi: string;
  penanggung_jawab: string;
  jumlah_anggota: number;
  gambar: string | null;
  gambar_utama: string | null;
  quote_utama: string | null;
  quote_penutup: string | null;
  anggota: Array<{
    id: number;
    nama_anggota: string;
    jabatan: string | null;
    foto: string | null;
    urutan: number;
  }>;
  created_at: string;
};

type AnggotaForm = {
  clientId: string;
  namaAnggota: string;
  jabatan: string;
  foto: string;
};

type BidangManagerProps = {
  canManageAll: boolean;
};

const createEmptyForm = () => ({
  namaBidang: "",
  deskripsi: "",
  penanggungJawab: "",
  jumlahAnggota: "",
  gambar: "",
  gambarUtama: "",
  quoteUtama: "Tanpa Rencana, Kamu Sampai di Sini.\nBukan seperti kafe. Tapi Warteg",
  quotePenutup: "Cerita-Cerita Bermula di Sini. Beberapa Berakhir Dengan Baik.",
  anggota: [] as AnggotaForm[]
});

export function BidangManager({ canManageAll }: BidangManagerProps) {
  const [form, setForm] = useState(createEmptyForm);
  const [entries, setEntries] = useState<Bidang[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [uploadingAnggotaIndex, setUploadingAnggotaIndex] = useState<number | null>(null);
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

  const uploadImage = async (file: File, folder: string) => {
    const body = new FormData();
    body.append("file", file);
    body.append("folder", folder);
    const res = await fetch("/api/upload", { method: "POST", body });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error ?? "Upload gagal");
    return String(json.url);
  };

  const handleHeroFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingHero(true);
    setError(null);
    try {
      const url = await uploadImage(file, "bidang-hero");
      setForm((prev) => ({ ...prev, gambarUtama: url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengunggah foto halaman bidang");
    } finally {
      setIsUploadingHero(false);
    }
  };

  const addAnggota = () => {
    setForm((prev) => ({
      ...prev,
      anggota: [...prev.anggota, { clientId: crypto.randomUUID(), namaAnggota: "", jabatan: "", foto: "" }]
    }));
  };

  const updateAnggota = (index: number, values: Partial<AnggotaForm>) => {
    setForm((prev) => ({
      ...prev,
      anggota: prev.anggota.map((item, itemIndex) => (itemIndex === index ? { ...item, ...values } : item))
    }));
  };

  const removeAnggota = (index: number) => {
    setForm((prev) => ({ ...prev, anggota: prev.anggota.filter((_, itemIndex) => itemIndex !== index) }));
  };

  const handleAnggotaFileChange = async (index: number, file?: File) => {
    if (!file) return;
    setUploadingAnggotaIndex(index);
    setError(null);
    try {
      const url = await uploadImage(file, "anggota-bidang");
      updateAnggota(index, { foto: url });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengunggah foto anggota");
    } finally {
      setUploadingAnggotaIndex(null);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(createEmptyForm());
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
      gambar: entry.gambar ?? "",
      gambarUtama: entry.gambar_utama ?? "",
      quoteUtama: entry.quote_utama ?? "Tanpa Rencana, Kamu Sampai di Sini.\nBukan seperti kafe. Tapi Warteg",
      quotePenutup: entry.quote_penutup ?? "Cerita-Cerita Bermula di Sini. Beberapa Berakhir Dengan Baik.",
      anggota: (entry.anggota ?? []).map((item) => ({
        clientId: String(item.id),
        namaAnggota: item.nama_anggota,
        jabatan: item.jabatan ?? "",
        foto: item.foto ?? ""
      }))
    });
    setError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(createEmptyForm());
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
          <table className="w-full min-w-[860px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-divider text-xs font-semibold uppercase tracking-wide text-clay">
                <th className="py-3 pr-4">Logo</th>
                <th className="py-3 pr-4">Foto Halaman</th>
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
                  <td colSpan={7} className="py-6 text-center text-clay">
                    Memuat data…
                  </td>
                </tr>
              ) : entries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-clay">
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
                    <td className="py-3 pr-4">
                      {entry.gambar_utama ? (
                        <Image src={entry.gambar_utama} alt="" width={72} height={40} className="h-10 w-[72px] rounded-lg object-cover" />
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
            className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-divider bg-white p-6 shadow-card sm:p-8"
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

              <div className="sm:col-span-1">
                <label htmlFor="gambarUtama" className="text-sm font-semibold text-brown">
                  Foto Utama Halaman Bidang
                </label>
                <input
                  id="gambarUtama"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={handleHeroFileChange}
                  className="mt-2 block w-full text-sm text-brown file:mr-4 file:rounded-full file:border-0 file:bg-orange file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                />
                <p className="mt-1 text-xs text-clay">Gunakan foto landscape untuk area hero di halaman publik.</p>
                {isUploadingHero ? <p className="mt-1 text-xs text-clay">Mengunggah…</p> : null}
                {form.gambarUtama ? (
                  <Image src={form.gambarUtama} alt="Pratinjau foto utama" width={320} height={140} className="mt-2 h-28 w-full rounded-xl object-cover" />
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

              <div className="sm:col-span-1">
                <label htmlFor="quoteUtama" className="text-sm font-semibold text-brown">
                  Quote Utama (Kiri)
                </label>
                <textarea
                  id="quoteUtama"
                  rows={4}
                  value={form.quoteUtama}
                  onChange={(e) => setForm({ ...form, quoteUtama: e.target.value })}
                  className={textareaClass}
                  placeholder="Tanpa Rencana, Kamu Sampai di Sini..."
                />
              </div>

              <div className="sm:col-span-1">
                <label htmlFor="quotePenutup" className="text-sm font-semibold text-brown">
                  Quote Penutup (Kanan)
                </label>
                <textarea
                  id="quotePenutup"
                  rows={4}
                  value={form.quotePenutup}
                  onChange={(e) => setForm({ ...form, quotePenutup: e.target.value })}
                  className={textareaClass}
                  placeholder="Cerita-Cerita Bermula di Sini..."
                />
              </div>

              <fieldset className="rounded-2xl border border-divider bg-cream/50 p-4 sm:col-span-2 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <legend className="text-base font-semibold text-brown">Daftar Anggota Bidang</legend>
                    <p className="mt-1 text-xs text-clay">Nama, jabatan, dan foto akan tampil sebagai roster pada halaman publik.</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, jumlahAnggota: String(prev.anggota.length) }))}
                      className="rounded-full border border-clay/30 bg-white px-3 py-2 text-xs font-semibold text-clay hover:text-brown"
                    >
                      Samakan jumlah ({form.anggota.length})
                    </button>
                    <button type="button" onClick={addAnggota} className="inline-flex items-center gap-2 rounded-full bg-brown px-4 py-2 text-xs font-semibold text-white hover:bg-orange">
                      <UserPlus size={15} /> Tambah Anggota
                    </button>
                  </div>
                </div>

                {form.anggota.length === 0 ? (
                  <p className="mt-5 rounded-xl border border-dashed border-clay/30 bg-white/60 px-4 py-6 text-center text-sm text-clay">Belum ada anggota yang ditambahkan.</p>
                ) : (
                  <div className="mt-5 space-y-4">
                    {form.anggota.map((anggota, index) => (
                      <div key={anggota.clientId} className="grid gap-3 rounded-xl border border-divider bg-white p-4 sm:grid-cols-[80px_1fr_1fr_auto] sm:items-start">
                        <div>
                          {anggota.foto ? (
                            <Image src={anggota.foto} alt="" width={80} height={80} className="h-20 w-20 rounded-xl object-cover" />
                          ) : (
                            <div className="grid h-20 w-20 place-items-center rounded-xl bg-orange-soft text-orange"><ImagePlus size={24} /></div>
                          )}
                          <label className="mt-2 block cursor-pointer text-center text-[11px] font-semibold text-orange hover:underline">
                            {uploadingAnggotaIndex === index ? "Mengunggah…" : "Pilih foto"}
                            <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="sr-only" disabled={uploadingAnggotaIndex !== null} onChange={(event) => handleAnggotaFileChange(index, event.target.files?.[0])} />
                          </label>
                        </div>
                        <div>
                          <label htmlFor={`anggota-nama-${index}`} className="text-xs font-semibold text-brown">Nama Anggota</label>
                          <input id={`anggota-nama-${index}`} required value={anggota.namaAnggota} onChange={(e) => updateAnggota(index, { namaAnggota: e.target.value })} className={inputClass} placeholder="Nama lengkap" />
                        </div>
                        <div>
                          <label htmlFor={`anggota-jabatan-${index}`} className="text-xs font-semibold text-brown">Jabatan / Posisi</label>
                          <input id={`anggota-jabatan-${index}`} value={anggota.jabatan} onChange={(e) => updateAnggota(index, { jabatan: e.target.value })} className={inputClass} placeholder="Staf, Wakil Ketua, dll." />
                        </div>
                        <button type="button" onClick={() => removeAnggota(index)} aria-label={`Hapus anggota ${index + 1}`} className="mt-7 rounded-full p-2 text-clay hover:bg-red/10 hover:text-red">
                          <Trash2 size={17} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </fieldset>

              {error ? (
                <p role="alert" className="text-sm text-red sm:col-span-2">
                  {error}
                </p>
              ) : null}

              <div className="flex items-center gap-3 sm:col-span-2">
                <Button className="px-8" disabled={isSubmitting || isUploading || isUploadingHero || uploadingAnggotaIndex !== null}>
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
