"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { FieldConfig, TableConfig } from "@/lib/data/types";
import { AdminDialog } from "./AdminDialog";
type Option = {
    value: number;
    label: string;
};
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
        }
        else if (field.type === "date") {
            values[field.name] = String(raw).slice(0, 10);
        }
        else if (field.type === "datetime") {
            values[field.name] = String(raw).slice(0, 16);
        }
        else {
            values[field.name] = String(raw);
        }
    }
    return values;
}
function resolveFkLabel(fkOptions: Record<string, Option[]>, field: FieldConfig, rawValue: unknown) {
    if (!field.fkTable)
        return String(rawValue ?? "-");
    const options = fkOptions[field.fkTable] ?? [];
    const match = options.find((opt) => String(opt.value) === String(rawValue));
    return match?.label ?? String(rawValue ?? "-");
}
const inputClass = "admin-input mt-2";
const textareaClass = "admin-input admin-textarea mt-2";
export function DataForm({ config, canManage = false }: {
    config: TableConfig;
    canManage?: boolean;
}) {
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
    const [listError, setListError] = useState<string | null>(null);
    const busyRef = useRef(false);
    const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [toast, setToast] = useState<string | null>(null);
    const fkFields = useMemo(() => config.fields.filter((f) => f.type === "fk-select" && f.fkTable), [config]);
    const showToast = (message: string) => {
        setToast(message);
        if (toastTimer.current)
            clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToast(null), 3000);
    };
    const loadData = useCallback(async (signal?: AbortSignal) => {
        setIsLoading(true);
        setListError(null);
        try {
            const read = async (url: string) => {
                const response = await fetch(url, { signal });
                const json = await response.json();
                if (!response.ok)
                    throw new Error(json.error ?? "Gagal memuat data. Silakan coba lagi.");
                if (!Array.isArray(json.data))
                    throw new Error("Respons data tidak valid.");
                return json.data;
            };
            const [rows, options] = await Promise.all([read(`/api/data/${config.slug}`), Promise.all(fkFields.map(async (field) => ({ table: field.fkTable!, data: await read(`/api/data/${field.fkTable}/options`) })))]);
            if (signal?.aborted)
                return;
            setEntries(rows);
            setFkOptions(Object.fromEntries(options.map(option => [option.table, option.data])));
        }
        catch (err) {
            if (!signal?.aborted)
                setListError(err instanceof Error ? err.message : "Koneksi bermasalah. Coba lagi.");
        }
        finally {
            if (!signal?.aborted)
                setIsLoading(false);
        }
    }, [config.slug, fkFields]);
    useEffect(() => { const controller = new AbortController(); void loadData(controller.signal); return () => controller.abort(); }, [loadData]);
    useEffect(() => () => { if (toastTimer.current)
        clearTimeout(toastTimer.current); }, []);
    const handleChange = (name: string, value: string) => {
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };
    const handleFileChange = async (field: FieldConfig, file: File | null) => {
        if (!file)
            return;
        setUploadState((prev) => ({ ...prev, [field.name]: "uploading" }));
        try {
            const body = new FormData();
            body.append("file", file);
            body.append("folder", config.slug);
            const res = await fetch("/api/upload", { method: "POST", body });
            if (!res.ok)
                throw new Error("Upload gagal");
            const json = await res.json();
            handleChange(field.name, json.url);
            setUploadState((prev) => ({ ...prev, [field.name]: "idle" }));
        }
        catch {
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
        if (busyRef.current || isUploading)
            return;
        setIsModalOpen(false);
        setEditingId(null);
        setFormValues(defaultsFor(config));
        setUploadState({});
        setError(null);
    };
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (busyRef.current || isUploading)
            return;
        busyRef.current = true;
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
            busyRef.current = false;
            closeModal();
            await loadData();
            showToast(`${config.label} berhasil ${actionLabel}`);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Gagal menyimpan data");
        }
        finally {
            setIsSubmitting(false);
            busyRef.current = false;
        }
    };
    const handleDelete = async (entry: Record<string, unknown>) => {
        const id = String(entry[config.idColumn]);
        if (isDeletingId || busyRef.current)
            return;
        if (!window.confirm(`Hapus ${config.label} ini?`))
            return;
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
            await loadData();
            showToast(`${config.label} berhasil dihapus`);
        }
        catch (err) {
            setListError(err instanceof Error ? err.message : "Gagal menghapus data");
        }
        finally {
            setIsDeletingId(null);
        }
    };
    const renderField = (field: FieldConfig) => {
        const colSpanClass = field.colSpan === 2 ? "sm:col-span-2" : "sm:col-span-1";
        const value = formValues[field.name] ?? "";
        if (field.type === "textarea") {
            return (<div key={field.name} className={colSpanClass}>
          <label htmlFor={field.name} className="text-sm font-semibold text-ink">
            {field.label}{field.required ? " *" : ""}
          </label>
          <textarea id={field.name} required={field.required} rows={3} value={value} onChange={(e) => handleChange(field.name, e.target.value)} className={textareaClass} placeholder={field.placeholder}/>
        </div>);
        }
        if (field.type === "select-enum") {
            return (<div key={field.name} className={colSpanClass}>
          <label htmlFor={field.name} className="text-sm font-semibold text-ink">
            {field.label}{field.required ? " *" : ""}
          </label>
          <select id={field.name} required={field.required} value={value} onChange={(e) => handleChange(field.name, e.target.value)} className={inputClass}>
            {field.enumOptions?.map((opt) => (<option key={opt} value={opt}>
                {opt}
              </option>))}
          </select>
        </div>);
        }
        if (field.type === "fk-select") {
            const options = (field.fkTable && fkOptions[field.fkTable]) || [];
            return (<div key={field.name} className={colSpanClass}>
          <label htmlFor={field.name} className="text-sm font-semibold text-ink">
            {field.label}{field.required ? " *" : ""}
          </label>
          <select id={field.name} required={field.required} value={value} onChange={(e) => handleChange(field.name, e.target.value)} className={inputClass}>
            <option value="">Pilih {field.label}</option>
            {options.map((opt) => (<option key={opt.value} value={opt.value}>
                {opt.label}
              </option>))}
          </select>
        </div>);
        }
        if (field.type === "file") {
            const status = uploadState[field.name];
            return (<div key={field.name} className={colSpanClass}>
          <label htmlFor={field.name} className="text-sm font-semibold text-ink">
            {field.label}{field.required ? " *" : ""}
          </label>
          <input id={field.name} type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(e) => handleFileChange(field, e.target.files?.[0] ?? null)} className="mt-2 block w-full text-sm text-ink file:mr-4 file:rounded-[10px] file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-charcoal"/>
          {status === "uploading" && <p role="status" className="mt-1 text-[13px] admin-muted">Mengunggah...</p>}
          {status === "error" && <p role="alert" className="mt-1 text-[13px] text-red">Gagal mengunggah file</p>}
          {value && status !== "uploading" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={value} alt="" className="mt-2 h-20 w-20 rounded-xl object-cover"/>) : null}
        </div>);
        }
        const inputType = field.type === "number" ? "number" : field.type === "date" ? "date" : field.type === "datetime" ? "datetime-local" : "text";
        return (<div key={field.name} className={colSpanClass}>
        <label htmlFor={field.name} className="text-sm font-semibold text-ink">
          {field.label}{field.required ? " *" : ""}
        </label>
        <input id={field.name} type={inputType} required={field.required} value={value} onChange={(e) => handleChange(field.name, e.target.value)} className={inputClass} placeholder={field.placeholder}/>
      </div>);
    };
    const renderValue = (entry: Record<string, unknown>, field: FieldConfig) => {
        const value = field.type === "fk-select" ? resolveFkLabel(fkOptions, field, entry[field.name]) : String(entry[field.name] ?? "—");
        if (field.type === "file" && entry[field.name]) {
            // eslint-disable-next-line @next/next/no-img-element
            return <img src={String(entry[field.name])} alt={`Preview ${field.label}`} className="h-14 w-14 rounded-lg object-cover"/>;
        }
        if (field.name.startsWith("link") && entry[field.name])
            return <a href={value} target="_blank" rel="noopener noreferrer" className="admin-data-link">{value}</a>;
        return <span title={value} className="admin-cell-text">{value}</span>;
    };
    const actions = (entry: Record<string, unknown>) => <div className="flex gap-2"><button type="button" className="admin-icon-button" onClick={() => openEdit(entry)} aria-label={`Edit ${config.label}`} disabled={!!isDeletingId}><Pencil size={18}/></button><button type="button" className="admin-icon-button text-red" onClick={() => handleDelete(entry)} aria-label={`Hapus ${config.label}`} disabled={!!isDeletingId}><Trash2 size={18}/></button></div>;
    return <div className="flex min-w-0 flex-col gap-6">
    <section className="admin-panel min-w-0">
      <div className="flex flex-wrap items-start justify-between gap-4"><div className="min-w-0"><h2>Daftar {config.label}</h2>{config.description && <p className="admin-muted mt-2 max-w-[65ch]">{config.description}</p>}</div>{canManage && <Button appearance="admin" type="button" onClick={openCreate}><Plus size={18}/>Tambah {config.label}</Button>}</div>
      {isLoading ? <p role="status" className="admin-empty">Memuat data...</p> : listError ? <div className="admin-alert mt-6" role="alert"><p>{listError}</p><Button appearance="admin" variant="secondary" className="mt-3" onClick={() => void loadData()}>Coba lagi</Button></div> : entries.length === 0 ? <p className="admin-empty">Belum ada data {config.label.toLowerCase()}.</p> : <>
        <div className="admin-table-scroll mt-6 hidden md:block" tabIndex={0} aria-label={`Tabel ${config.label}, gulir horizontal jika diperlukan`}><table className="admin-table"><thead><tr>{config.fields.map(field => <th key={field.name}>{field.label}</th>)}<th>Detail{canManage ? " / Aksi" : ""}</th></tr></thead><tbody>{entries.map(entry => <tr key={String(entry[config.idColumn])}>{config.fields.map(field => <td key={field.name}>{renderValue(entry, field)}</td>)}<td><details className="admin-row-detail"><summary>Detail lengkap</summary><dl>{config.fields.map(field => <div key={field.name}><dt className="font-semibold">{field.label}</dt><dd>{renderValue(entry, field)}</dd></div>)}</dl></details>{canManage && actions(entry)}</td></tr>)}</tbody></table></div>
        <div className="mt-6 grid gap-4 md:hidden">{entries.map(entry => <article key={String(entry[config.idColumn])} className="admin-data-card"><dl className="grid gap-3">{config.fields.slice(0, 3).map(field => <div key={field.name}><dt className="admin-muted text-[13px]">{field.label}</dt><dd className="mt-1 font-medium">{renderValue(entry, field)}</dd></div>)}</dl><details className="admin-row-detail mt-3"><summary>Detail lengkap</summary><dl>{config.fields.map(field => <div key={field.name}><dt className="admin-muted text-[13px]">{field.label}</dt><dd>{renderValue(entry, field)}</dd></div>)}</dl></details>{canManage && <div className="mt-3 border-t border-line pt-3">{actions(entry)}</div>}</article>)}</div>
      </>}
    </section>
    {canManage && <AdminDialog open={isModalOpen} onClose={closeModal} title={`${editingId ? "Edit" : "Tambah"} ${config.label}`} description={config.description} busy={isSubmitting || isUploading}>
      <form onSubmit={handleSubmit} className="admin-dialog-form" aria-busy={isSubmitting || isUploading}><div className="admin-dialog-body"><fieldset disabled={isSubmitting || isUploading} className="grid min-w-0 gap-5 sm:grid-cols-2">{config.fields.map(renderField)}</fieldset></div><footer className="admin-dialog-footer">{error && <p role="alert" className="admin-alert mb-3">{error}</p>}<div className="flex flex-wrap gap-3"><Button appearance="admin" disabled={isSubmitting || isUploading}>{isSubmitting ? "Menyimpan..." : "Simpan perubahan"}</Button><Button appearance="admin" variant="secondary" type="button" onClick={closeModal} disabled={isSubmitting || isUploading}>Batal</Button></div></footer></form>
    </AdminDialog>}
    {toast && <div role="status" className="admin-toast">{toast}</div>}
  </div>;
}
