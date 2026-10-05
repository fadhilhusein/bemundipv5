"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Pencil, Plus, Sparkles, Trash2, UserPlus, X } from "lucide-react";
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
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);
  const [initialForm, setInitialForm] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const busyRef = useRef(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const busy = isSubmitting || isUploading || isUploadingHero;
  const dirty = JSON.stringify(form) !== initialForm;
  const memberCount = form.anggota.filter((item) => item.namaAnggota.trim()).length;

  const showToast = (message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(null), 5000);
  };

  const loadEntries = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    setListError(null);
    try {
      const res = await fetch("/api/bidang", { signal });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(res.status === 401 ? "Sesi berakhir. Silakan masuk kembali." : json?.error ?? "Gagal memuat daftar bidang.");
      if (!Array.isArray(json?.data)) throw new Error("Respons daftar bidang tidak valid.");
      setEntries(json.data);
    } catch (err) {
      if (!signal?.aborted) setListError(err instanceof Error ? err.message : "Gagal memuat daftar bidang.");
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void loadEntries(controller.signal);
    return () => {
      controller.abort();
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, [loadEntries]);

  useEffect(() => {
    if (!isModalOpen) return;
    dialogRef.current?.showModal();
    dialogRef.current?.querySelector<HTMLInputElement>("#namaBidang")?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [isModalOpen]);

  useEffect(() => {
    if (!isModalOpen || (!dirty && !busy)) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isModalOpen, dirty, busy]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || busyRef.current) return;
    if (!validImage(file)) return;
    busyRef.current = true;
    setIsUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", "bidang");
      const res = await fetch("/api/upload", { method: "POST", body });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error ?? "Upload gagal");
      if (!json?.url) throw new Error("URL gambar tidak tersedia.");
      setForm((prev) => ({ ...prev, gambar: json.url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengunggah logo");
    } finally {
      busyRef.current = false;
      setIsUploading(false);
    }
  };

  const uploadImage = async (file: File, folder: string) => {
    const body = new FormData();
    body.append("file", file);
    body.append("folder", folder);
    const res = await fetch("/api/upload", { method: "POST", body });
    const json = await res.json().catch(() => null);
    if (!res.ok) throw new Error(json?.error ?? "Upload gagal");
    if (!json?.url) throw new Error("URL gambar tidak tersedia.");
    return String(json.url);
  };

  const handleHeroFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || busyRef.current) return;
    if (!validImage(file)) return;
    busyRef.current = true;
    setIsUploadingHero(true);
    setError(null);
    try {
      const url = await uploadImage(file, "bidang-hero");
      setForm((prev) => ({ ...prev, gambarUtama: url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengunggah foto halaman bidang");
    } finally {
      busyRef.current = false;
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

  const validImage = (file: File) => {
    if (file.size > 5 * 1024 * 1024) { setError("Ukuran gambar maksimal 5 MB."); return false; }
    if (!["image/png", "image/jpeg", "image/webp", "image/gif"].includes(file.type)) { setError("Gunakan PNG, JPG, WebP, atau GIF."); return false; }
    return true;
  };

  const moveAnggota = (index: number, direction: number) => {
    setForm((prev) => {
      const anggota = [...prev.anggota];
      const target = index + direction;
      if (target < 0 || target >= anggota.length) return prev;
      [anggota[index], anggota[target]] = [anggota[target], anggota[index]];
      return { ...prev, anggota };
    });
  };

  const openCreate = () => {
    openerRef.current = document.activeElement as HTMLElement;
    setEditingId(null);
    setForm(createEmptyForm());
    setInitialForm(JSON.stringify(createEmptyForm()));
    setError(null);
    setIsModalOpen(true);
  };

  const openEdit = (entry: Bidang) => {
    openerRef.current = document.activeElement as HTMLElement;
    setEditingId(entry.id);
    const nextForm = {
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
    };
    setForm(nextForm);
    setInitialForm(JSON.stringify(nextForm));
    setError(null);
    setIsModalOpen(true);
  };

  const finishClose = () => {
    dialogRef.current?.close();
    setIsModalOpen(false);
    setEditingId(null);
    setForm(createEmptyForm());
    setError(null);
    openerRef.current?.focus();
  };

  const closeModal = () => {
    if (busy || busyRef.current) return;
    if (dirty && !window.confirm("Perubahan belum disimpan. Tutup dan buang perubahan?")) return;
    finishClose();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busyRef.current) return;
    if (form.anggota.length > 200) { setError("Maksimal 200 anggota per bidang."); return; }
    busyRef.current = true;
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
        const json = await res.json().catch(() => null);
        throw new Error(json?.error ?? "Gagal menyimpan data");
      }

      const actionLabel = editingId ? "diperbarui" : "ditambahkan";
      finishClose();
      showToast(`Bidang berhasil ${actionLabel}`);
      await loadEntries();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan data");
    } finally {
      busyRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (entry: Bidang) => {
    if (busyRef.current) return;
    if (!window.confirm(`Hapus bidang "${entry.nama_bidang}"?`)) return;
    busyRef.current = true;
    setDeletingId(entry.id);
    setPageError(null);
    try {
      const res = await fetch(`/api/bidang?id=${entry.id}`, { method: "DELETE" });
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.error ?? "Gagal menghapus data");
      }
      showToast(`Bidang "${entry.nama_bidang}" dihapus`);
      await loadEntries();
    } catch (err) {
      setPageError(err instanceof Error ? err.message : "Gagal menghapus data");
    } finally {
      busyRef.current = false;
      setDeletingId(null);
    }
  };

  const inputClass =
    "mt-2 h-12 w-full rounded-full border border-divider bg-white px-5 text-sm text-brown outline-none focus:border-orange focus:ring-2 focus:ring-orange/20";
  const textareaClass =
    "mt-2 w-full rounded-2xl border border-divider bg-white px-5 py-3 text-sm text-brown outline-none focus:border-orange focus:ring-2 focus:ring-orange/20";

  return (
    <div className="flex min-w-0 flex-col gap-8">
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
            <Button type="button" disabled={deletingId !== null || isSubmitting} onClick={openCreate} className="px-5">
              <Plus size={16} />
              Tambah Bidang
            </Button>
          ) : null}
        </div>

        {pageError ? <p role="alert" className="mt-5 rounded-xl border border-red/30 bg-red/5 p-4 text-sm text-red">{pageError}</p> : null}
        {listError ? <div role="alert" className="mt-5 rounded-xl border border-red/30 bg-red/5 p-4 text-sm text-red"><p>{listError}</p><button type="button" onClick={() => void loadEntries()} className="mt-3 rounded-lg border border-red/30 px-4 py-2 font-semibold">Coba lagi</button>{listError.includes("Sesi") ? <Link href="/login" className="ml-4 underline">Masuk kembali</Link> : null}</div> : null}
        <div className="mt-6 space-y-4 md:hidden">
          {isLoading ? <p role="status" className="py-6 text-center text-clay">Memuat data…</p> : entries.length === 0 && !listError ? <p className="py-6 text-center text-clay">Belum ada data bidang.</p> : entries.map((entry) => (
            <article key={entry.id} className="rounded-xl border border-divider p-4">
              <h3 className="break-words font-semibold text-brown">{entry.nama_bidang}</h3>
              <p className="mt-1 text-sm text-clay">{entry.penanggung_jawab} · {entry.jumlah_anggota} anggota</p>
              <p className="my-4 line-clamp-3 break-words text-sm text-clay">{entry.deskripsi}</p>
              <div className="flex flex-wrap gap-2">
                <button type="button" disabled={deletingId !== null || isSubmitting} onClick={() => openEdit(entry)} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-divider px-3 text-sm text-brown"><Pencil size={16} />Edit</button>
                <Link href="/dashboard/program-unggulan" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-divider px-3 text-sm text-brown"><Sparkles size={16} />Program</Link>
                <Link href={`/bidang/${entry.id}`} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center rounded-lg border border-divider px-3 text-sm text-brown" aria-label={`Lihat ${entry.nama_bidang} di tab baru`}>Lihat</Link>
                {canManageAll ? <button type="button" disabled={deletingId !== null} onClick={() => void handleDelete(entry)} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-red/20 px-3 text-sm text-red"><Trash2 size={16} />{deletingId === entry.id ? "Menghapus…" : "Hapus"}</button> : null}
              </div>
            </article>
          ))}
        </div>
        <div className="mt-6 hidden overflow-x-auto md:block">
          <table className="w-full min-w-[860px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-divider text-xs font-semibold uppercase tracking-wide text-clay">
                <th className="py-3 pr-4">Logo</th>
                <th className="py-3 pr-4">Foto Halaman</th>
                <th className="py-3 pr-4">Nama Bidang</th>
                <th className="py-3 pr-4">Penanggung Jawab</th>
                <th className="py-3 pr-4">Jumlah Anggota</th>
                <th className="py-3 pr-4">Deskripsi</th>
                <th className="sticky right-0 bg-white py-3 pr-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-clay">
                    Memuat data…
                  </td>
                </tr>
              ) : entries.length === 0 && !listError ? (
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
                    <td className="py-3 pr-4 text-brown/70"><p className="line-clamp-3 w-60 break-words">{entry.deskripsi}</p></td>
                    <td className="sticky right-0 bg-white py-3 pr-4 pl-3">
                      <div className="flex items-center gap-3">
                        <Link
                          href="/dashboard/program-unggulan"
                          aria-label={`Program Unggulan ${entry.nama_bidang}`}
                          title="Kelola Program Unggulan"
                          className="inline-flex min-h-11 min-w-11 items-center justify-center text-clay hover:text-orange"
                        >
                          <Sparkles size={16} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => openEdit(entry)}
                          disabled={deletingId !== null || isSubmitting}
                          title="Edit bidang"
                          aria-label={`Edit ${entry.nama_bidang}`}
                          className="inline-flex min-h-11 min-w-11 items-center justify-center text-clay hover:text-orange disabled:opacity-40"
                        >
                          <Pencil size={16} />
                        </button>
                        {canManageAll ? (
                          <button
                            type="button"
                            onClick={() => handleDelete(entry)}
                            disabled={deletingId !== null}
                            title={deletingId === entry.id ? "Menghapus…" : "Hapus bidang"}
                            aria-label={`Hapus ${entry.nama_bidang}`}
                            className="inline-flex min-h-11 min-w-11 items-center justify-center text-clay hover:text-red disabled:opacity-40"
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
        <dialog ref={dialogRef} aria-labelledby="bidang-dialog-title" aria-describedby="bidang-dialog-description" onCancel={(event) => { event.preventDefault(); closeModal(); }} onClick={(event) => { if (event.target === event.currentTarget) closeModal(); }} className="m-auto w-[calc(100%-2rem)] max-w-4xl max-h-[90dvh] overflow-hidden rounded-2xl border border-divider bg-white p-0 text-brown shadow-2xl backdrop:bg-black/40">
          <div className="flex max-h-[90dvh] flex-col">
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-divider px-5 py-4 sm:px-8">
              <div>
                <h2 id="bidang-dialog-title" className="font-display text-2xl font-medium text-brown">
                  {editingId ? "Edit Bidang" : "Tambah Bidang"}
                </h2>
                <p id="bidang-dialog-description" className="mt-1 text-sm text-clay">
                  Kelola profil, hero, dan anggota. Kolom bertanda * wajib diisi.
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                disabled={busy}
                aria-label="Tutup"
                className="inline-flex min-h-11 min-w-11 items-center justify-center text-clay transition hover:text-brown disabled:opacity-40"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col" aria-busy={busy}>
              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-8">
              <fieldset disabled={busy} className="grid min-w-0 gap-5 sm:grid-cols-2">
              <legend className="mb-4 text-lg font-semibold text-brown">Profil Bidang</legend>
              <div className="sm:col-span-1">
                <label htmlFor="namaBidang" className="text-sm font-semibold text-brown">
                  Nama Bidang *
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
                  Penanggung Jawab (Ketua Bidang) *
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
                  Jumlah Anggota *
                </label>
                <input
                  id="jumlahAnggota"
                  type="number"
                  min={0}
                  step={1}
                  required
                  value={form.jumlahAnggota}
                  onChange={(e) => setForm({ ...form, jumlahAnggota: e.target.value })}
                  className={inputClass}
                  placeholder="mis. 12"
                />
                <p className="mt-2 text-xs text-clay">Jumlah dapat berbeda jika daftar anggota belum lengkap.</p>
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
                <p className="mt-2 text-xs text-clay">PNG, JPG, WebP, atau GIF. Maksimal 5 MB.</p>
                {isUploading ? <p className="mt-1 text-xs text-clay">Mengunggah…</p> : null}
                {form.gambar ? (
                  <Image src={form.gambar} alt="" width={80} height={80} className="mt-2 h-20 w-20 rounded-xl object-cover" />
                ) : null}
              </div>

              </fieldset>
              <fieldset disabled={busy} className="mt-8 grid min-w-0 gap-5 border-t border-divider pt-6 sm:grid-cols-2">
              <legend className="px-1 text-lg font-semibold text-brown">Konten Hero</legend>
              <div className="sm:col-span-2">
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
                <p className="mt-1 text-xs text-clay">Gunakan foto landscape. PNG, JPG, WebP, atau GIF; maksimal 5 MB.</p>
                {isUploadingHero ? <p className="mt-1 text-xs text-clay">Mengunggah…</p> : null}
                {form.gambarUtama ? (
                  <div>
                  <Image src={form.gambarUtama} alt="Pratinjau foto utama" width={320} height={140} className="mt-2 h-28 w-full rounded-xl object-cover" />
                  <button type="button" disabled={busy} onClick={() => setForm((prev) => ({ ...prev, gambarUtama: "" }))} className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg border border-red/20 px-4 text-sm font-semibold text-red hover:bg-red/10 disabled:opacity-40">
                    <Trash2 size={16} aria-hidden="true" /> Hapus gambar
                  </button>
                  <p className="mt-2 text-xs text-clay">Penghapusan diterapkan setelah klik Simpan Perubahan.</p>
                  </div>
                ) : null}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="deskripsi" className="text-sm font-semibold text-brown">
                  Deskripsi *
                </label>
                <textarea
                  id="deskripsi"
                  required
                  rows={5}
                  aria-describedby="deskripsi-help"
                  value={form.deskripsi}
                  onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                  className={textareaClass}
                  placeholder="Ringkasan tugas dan ruang lingkup bidang"
                />
                <p id="deskripsi-help" className="mt-2 text-xs text-clay">Teks dimulai di kanan atas hero, kemudian sisanya berlanjut ke kiri bawah secara otomatis.</p>
              </div>

              <div className="sm:col-span-1">
                <label htmlFor="quoteUtama" className="text-sm font-semibold text-brown">
                  Quote Utama (Kiri)
                </label>
                <textarea
                  id="quoteUtama"
                  rows={4}
                  aria-describedby="quote-utama-help"
                  value={form.quoteUtama}
                  onChange={(e) => setForm({ ...form, quoteUtama: e.target.value })}
                  className={textareaClass}
                  placeholder="Tanpa Rencana, Kamu Sampai di Sini..."
                />
                <p id="quote-utama-help" className="mt-2 text-xs text-clay">Baris pertama menjadi judul besar. Tekan Enter untuk teks tulisan tangan pada baris berikutnya. Jika kosong, kutipan bawaan ditampilkan.</p>
              </div>

              <div className="sm:col-span-1">
                <label htmlFor="quotePenutup" className="text-sm font-semibold text-brown">
                  Quote Penutup (Kanan)
                </label>
                <textarea
                  id="quotePenutup"
                  aria-describedby="quote-penutup-help"
                  rows={4}
                  value={form.quotePenutup}
                  onChange={(e) => setForm({ ...form, quotePenutup: e.target.value })}
                  className={textareaClass}
                  placeholder="Cerita-Cerita Bermula di Sini..."
                />
                <p id="quote-penutup-help" className="mt-2 text-xs text-clay">Teks besar di kanan bawah hero. Jika kosong, kutipan bawaan ditampilkan.</p>
              </div>

              </fieldset>
              <fieldset disabled={busy} className="mt-8 rounded-2xl border border-divider bg-cream/50 p-4 sm:p-5">
                <legend className="px-1 text-base font-semibold text-brown">Daftar Anggota Bidang</legend>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="mt-1 text-xs text-clay">Nama dan jabatan tampil di halaman publik sesuai urutan daftar. Maksimal 200 anggota.</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, jumlahAnggota: String(memberCount) }))}
                      className="rounded-full border border-clay/30 bg-white px-3 py-2 text-xs font-semibold text-clay hover:text-brown"
                    >
                      Samakan jumlah ({memberCount})
                    </button>
                    <button type="button" disabled={form.anggota.length >= 200} onClick={addAnggota} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-brown px-4 py-2 text-xs font-semibold text-white hover:bg-orange disabled:opacity-40">
                      <UserPlus size={15} /> Tambah Anggota
                    </button>
                  </div>
                </div>

                {form.jumlahAnggota !== "" && Number(form.jumlahAnggota) !== memberCount ? <p role="status" className="mt-4 rounded-xl border border-orange/30 bg-orange-soft p-3 text-sm text-brown">Jumlah tercatat: {form.jumlahAnggota}. Daftar berisi {memberCount} anggota bernama. Gunakan “Samakan jumlah” jika daftar sudah lengkap.</p> : null}

                {form.anggota.length === 0 ? (
                  <p className="mt-5 rounded-xl border border-dashed border-clay/30 bg-white/60 px-4 py-6 text-center text-sm text-clay">Belum ada anggota yang ditambahkan.</p>
                ) : (
                  <div className="mt-5 space-y-4">
                    {form.anggota.map((anggota, index) => (
                      <div key={anggota.clientId} className="grid min-w-0 gap-3 rounded-xl border border-divider bg-white p-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor={`anggota-nama-${anggota.clientId}`} className="text-xs font-semibold text-brown">{index + 1}. Nama Anggota *</label>
                          <input id={`anggota-nama-${anggota.clientId}`} required value={anggota.namaAnggota} onChange={(e) => updateAnggota(index, { namaAnggota: e.target.value })} className={inputClass} placeholder="Nama lengkap" />
                        </div>
                        <div>
                          <label htmlFor={`anggota-jabatan-${anggota.clientId}`} className="text-xs font-semibold text-brown">Jabatan / Posisi</label>
                          <input id={`anggota-jabatan-${anggota.clientId}`} value={anggota.jabatan} onChange={(e) => updateAnggota(index, { jabatan: e.target.value })} className={inputClass} placeholder="Staf, Wakil Ketua, dll." />
                        </div>
                        <div className="flex flex-wrap gap-2 sm:col-span-2">
                          <button type="button" disabled={index === 0} onClick={() => moveAnggota(index, -1)} aria-label={`Pindahkan anggota ${index + 1} ke atas`} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-divider px-3 text-xs text-clay disabled:opacity-40"><ArrowUp size={16} />Naik</button>
                          <button type="button" disabled={index === form.anggota.length - 1} onClick={() => moveAnggota(index, 1)} aria-label={`Pindahkan anggota ${index + 1} ke bawah`} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-divider px-3 text-xs text-clay disabled:opacity-40"><ArrowDown size={16} />Turun</button>
                          <button type="button" onClick={() => { if ((anggota.namaAnggota || anggota.jabatan) && !window.confirm(`Hapus ${anggota.namaAnggota || "anggota ini"} dari daftar? Perubahan diterapkan setelah disimpan.`)) return; removeAnggota(index); }} aria-label={`Hapus anggota ${index + 1}`} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-red/20 px-3 text-xs text-red hover:bg-red/10"><Trash2 size={16} />Hapus</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </fieldset>

              </div>
              <div className="shrink-0 border-t border-divider bg-white px-5 py-4 sm:px-8">
              {error ? (
                <p role="alert" className="mb-3 text-sm text-red">
                  {error}
                </p>
              ) : null}

              <div className="flex flex-wrap items-center gap-3">
                <Button type="submit" className="px-5" disabled={busy}>
                  {isSubmitting ? "Menyimpan…" : isUploading || isUploadingHero ? "Mengunggah…" : editingId ? "Simpan Perubahan" : "Simpan Bidang"}
                </Button>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={busy}
                  className="min-h-11 px-3 text-sm font-semibold text-clay hover:text-brown disabled:opacity-40"
                >
                  Batal
                </button>
                <span role="status" className="text-xs text-clay">{busy ? "Tunggu hingga proses selesai." : dirty ? "Ada perubahan belum disimpan." : "Belum ada perubahan."}</span>
              </div>
              </div>
            </form>
          </div>
        </dialog>
      ) : null}

      {toast ? (
        <div role="status" className="fixed bottom-6 right-4 z-50 max-w-[calc(100%-2rem)] rounded-xl bg-brown px-5 py-3 text-sm font-semibold text-white shadow-card sm:right-6">
          {toast}
        </div>
      ) : null}
    </div>
  );
}
