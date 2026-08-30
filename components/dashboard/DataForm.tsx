"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { FieldConfig, TableConfig } from "@/lib/data/types";

type Option = { value: number; label: string };
type UploadStatus = "idle" | "uploading" | "error";

function defaultsFor(config: TableConfig): Record<string, string> {
  const values: Record<string, string> = {};
  for (const field of config.fields) {
    values[field.name] = field.defaultValue !== undefined ? String(field.defaultValue) : "";
  }
  return values;
}

function valuesFromEntry(config: TableConfig, entry: Record<string, unknown>): Record<string, string> {
  const values: Record<string, string> = {};
  for (const field of config.fields) {
    const raw = entry[field.name];
    if (raw === null || raw === undefined) {
      values[field.name] = "";
    } else if (field.type === "date") {
      values[field.name] = String(raw).slice(0, 10);
    } else if (field.type === "datetime") {
      values[field.name] = String(raw).slice(0, 16);
    } else {
      values[field.name] = String(raw);
    }
  }
  return values;
}

function resolveFkLabel(fkOptions: Record<string, Option[]>, field: FieldConfig, rawValue: unknown) {
  if (!field.fkTable) return String(rawValue ?? "-");
  const options = fkOptions[field.fkTable] ?? [];
  const match = options.find((opt) => String(opt.value) === String(rawValue));
  return match?.label ?? String(rawValue ?? "-");
}

const inputClass =
  "mt-2 h-12 w-full rounded-full border border-divider bg-white px-5 text-sm text-brown outline-none focus:border-orange focus:ring-2 focus:ring-orange/20";
const textareaClass =
  "mt-2 w-full rounded-2xl border border-divider bg-white px-5 py-3 text-sm text-brown outline-none focus:border-orange focus:ring-2 focus:ring-orange/20";

export function DataForm({ config, canManage = false }: { config: TableConfig; canManage?: boolean }) {
  const [formValues, setFormValues] = useState<Record<string, string>>(() => defaultsFor(config));
  const [entries, setEntries] = useState<Record<string, unknown>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fkOptions, setFkOptions] = useState<Record<string, Option[]>>({});
  const [uploadState, setUploadState] = useState<Record<string, UploadStatus>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const fkFields = useMemo(
    () => config.fields.filter((f) => f.type === "fk-select" && f.fkTable),
    [config]
  );

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setIsLoading(true);
      try {
        const fetchEntries = fetch(`/api/data/${config.slug}`).then(async (r) => {
          if (!r.ok) return { data: [] };
          return r.json().catch(() => ({ data: [] }));
        });

        const fetchOptions = Promise.all(
          fkFields.map(async (field) => {
            const res = await fetch(`/api/data/${field.fkTable}/options`);
            if (!res.ok) return { table: field.fkTable as string, data: [] };
            const json = await res.json().catch(() => ({ data: [] }));
            return { table: field.fkTable as string, data: json.data ?? [] };
          })
        );

        const [entriesJson, optionsList] = await Promise.all([fetchEntries, fetchOptions]);
        if (!cancelled) {
          setEntries(entriesJson?.data ?? []);
          const optionsMap: Record<string, Option[]> = {};
          for (const item of optionsList) {
            optionsMap[item.table] = item.data;
          }
          setFkOptions((prev) => ({ ...prev, ...optionsMap }));
        }
      } catch {
        if (!cancelled) {
          setEntries([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.slug]);

  useEffect(() => {
    if (!isModalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);

  const handleChange = (name: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (field: FieldConfig, file: File | null) => {
    if (!file) return;
    setUploadState((prev) => ({ ...prev, [field.name]: "uploading" }));

    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", config.slug);
      const res = await fetch("/api/upload", { method: "POST", body });
      if (!res.ok) throw new Error("Upload gagal");
      const json = await res.json();
      handleChange(field.name, json.url);
      setUploadState((prev) => ({ ...prev, [field.name]: "idle" }));
    } catch {
      setUploadState((prev) => ({ ...prev, [field.name]: "error" }));
    }
  };

  const isUploading = Object.values(uploadState).some((status) => status === "uploading");

  const openCreate = () => {
    setEditingId(null);
    setFormValues(defaultsFor(config));
    setUploadState({});
    setError(null);
    setIsModalOpen(true);
  };

  const openEdit = (entry: Record<string, unknown>) => {
    setEditingId(String(entry[config.idColumn]));
    setFormValues(valuesFromEntry(config, entry));
    setUploadState({});
    setError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormValues(defaultsFor(config));
    setUploadState({});
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const url = editingId ? `/api/data/${config.slug}/${editingId}` : `/api/data/${config.slug}`;
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues)
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error ?? "Gagal menyimpan data");
      }

      const actionLabel = editingId ? "diperbarui" : "ditambahkan";
      closeModal();
      const refreshed = await fetch(`/api/data/${config.slug}`);
      const refreshedJson = await refreshed.json();
      setEntries(refreshedJson.data ?? []);
      showToast(`${config.label} berhasil ${actionLabel}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan data");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (entry: Record<string, unknown>) => {
    const id = String(entry[config.idColumn]);
    if (!window.confirm(`Hapus ${config.label} ini?`)) return;

    setIsDeletingId(id);
    setError(null);

    try {
      const res = await fetch(`/api/data/${config.slug}/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error ?? "Gagal menghapus data");
      }

      if (editingId === id) {
        closeModal();
      }
      const refreshed = await fetch(`/api/data/${config.slug}`);
      const refreshedJson = await refreshed.json();
      setEntries(refreshedJson.data ?? []);
      showToast(`${config.label} berhasil dihapus`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus data");
    } finally {
      setIsDeletingId(null);
    }
  };

  const renderField = (field: FieldConfig) => {
    const colSpanClass = field.colSpan === 2 ? "sm:col-span-2" : "sm:col-span-1";
    const value = formValues[field.name] ?? "";

    if (field.type === "textarea") {
      return (
        <div key={field.name} className={colSpanClass}>
          <label htmlFor={field.name} className="text-sm font-semibold text-brown">
            {field.label}
          </label>
          <textarea
            id={field.name}
            required={field.required}
            rows={3}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className={textareaClass}
            placeholder={field.placeholder}
          />
        </div>
      );
    }

    if (field.type === "select-enum") {
      return (
        <div key={field.name} className={colSpanClass}>
          <label htmlFor={field.name} className="text-sm font-semibold text-brown">
            {field.label}
          </label>
          <select
            id={field.name}
            required={field.required}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className={inputClass}
          >
            {field.enumOptions?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (field.type === "fk-select") {
      const options = (field.fkTable && fkOptions[field.fkTable]) || [];
      return (
        <div key={field.name} className={colSpanClass}>
          <label htmlFor={field.name} className="text-sm font-semibold text-brown">
            {field.label}
          </label>
          <select
            id={field.name}
            required={field.required}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className={inputClass}
          >
            <option value="">Pilih {field.label}</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (field.type === "file") {
      const status = uploadState[field.name];
      return (
        <div key={field.name} className={colSpanClass}>
          <label htmlFor={field.name} className="text-sm font-semibold text-brown">
            {field.label}
          </label>
          <input
            id={field.name}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={(e) => handleFileChange(field, e.target.files?.[0] ?? null)}
            className="mt-2 block w-full text-sm text-brown file:mr-4 file:rounded-full file:border-0 file:bg-orange file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
          />
          {status === "uploading" && <p className="mt-1 text-xs text-clay">Mengunggah…</p>}
          {status === "error" && <p className="mt-1 text-xs text-red">Gagal mengunggah file</p>}
          {value && status !== "uploading" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="mt-2 h-20 w-20 rounded-xl object-cover" />
          ) : null}
        </div>
      );
    }

    const inputType =
      field.type === "number" ? "number" : field.type === "date" ? "date" : field.type === "datetime" ? "datetime-local" : "text";

    return (
      <div key={field.name} className={colSpanClass}>
        <label htmlFor={field.name} className="text-sm font-semibold text-brown">
          {field.label}
        </label>
        <input
          id={field.name}
          type={inputType}
          required={field.required}
          value={value}
          onChange={(e) => handleChange(field.name, e.target.value)}
          className={inputClass}
          placeholder={field.placeholder}
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-2xl border border-divider bg-white p-6 shadow-card sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-medium text-brown">Daftar {config.label}</h2>
            {config.description ? <p className="mt-1 text-sm text-clay">{config.description}</p> : null}
          </div>
          {canManage ? (
            <Button type="button" onClick={openCreate} className="px-5">
              <Plus size={16} />
              Tambah {config.label}
            </Button>
          ) : null}
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-divider text-xs font-semibold uppercase tracking-wide text-clay">
                {config.fields.map((field) => (
                  <th key={field.name} className="py-3 pr-4">
                    {field.label}
                  </th>
                ))}
                {canManage ? <th className="py-3 pr-4">Aksi</th> : null}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={config.fields.length + (canManage ? 1 : 0)} className="py-6 text-center text-clay">
                    Memuat data…
                  </td>
                </tr>
              ) : entries.length === 0 ? (
                <tr>
                  <td colSpan={config.fields.length + (canManage ? 1 : 0)} className="py-6 text-center text-clay">
                    Belum ada data.
                  </td>
                </tr>
              ) : (
                entries.map((entry) => (
                  <tr key={String(entry[config.idColumn])} className="border-b border-divider last:border-0">
                    {config.fields.map((field) => (
                      <td key={field.name} className="py-3 pr-4 max-w-sm text-brown/90">
                        {field.type === "file" && entry[field.name] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={String(entry[field.name])} alt="" className="h-10 w-10 rounded-lg object-cover" />
                        ) : field.type === "fk-select" ? (
                          resolveFkLabel(fkOptions, field, entry[field.name])
                        ) : field.type === "select-enum" && typeof entry[field.name] === "string" ? (
                          <span className="inline-flex rounded-full bg-peach/30 px-2.5 py-0.5 text-xs font-semibold capitalize text-brown">
                            {String(entry[field.name]).replace(/_/g, " ")}
                          </span>
                        ) : field.name.startsWith("link") && entry[field.name] ? (
                          <a
                            href={String(entry[field.name])}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="max-w-[200px] truncate block text-orange hover:underline"
                          >
                            {String(entry[field.name])}
                          </a>
                        ) : (
                          String(entry[field.name] ?? "-")
                        )}
                      </td>
                    ))}
                    {canManage ? (
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => openEdit(entry)}
                            aria-label={`Edit ${config.label}`}
                            className="text-clay hover:text-orange"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(entry)}
                            disabled={isDeletingId === String(entry[config.idColumn])}
                            aria-label={`Hapus ${config.label}`}
                            className="text-clay hover:text-red disabled:opacity-50"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    ) : null}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {canManage && isModalOpen ? (
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
                  {editingId ? `Edit ${config.label}` : `Tambah ${config.label}`}
                </h2>
                {config.description ? <p className="mt-1 text-sm text-clay">{config.description}</p> : null}
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
              {config.fields.map(renderField)}

              {error ? (
                <p role="alert" className="text-sm text-red sm:col-span-2">
                  {error}
                </p>
              ) : null}

              <div className="flex items-center gap-3 sm:col-span-2">
                <Button className="px-8" disabled={isSubmitting || isUploading}>
                  {isSubmitting ? "Menyimpan…" : editingId ? "Simpan Perubahan" : `Simpan ${config.label}`}
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