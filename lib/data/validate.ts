import type { FieldConfig, TableConfig } from "@/lib/data/types";

export function coerceValue(field: FieldConfig, raw: unknown): { value?: unknown; error?: string } {
  const isEmpty = raw === undefined || raw === null || raw === "";

  if (isEmpty) {
    if (field.required) return { error: `${field.label} wajib diisi` };
    return { value: null };
  }

  if (field.type === "number") {
    const num = Number(raw);
    if (!Number.isFinite(num)) return { error: `${field.label} harus berupa angka` };
    return { value: num };
  }

  if (field.type === "fk-select") {
    const num = Number(raw);
    if (!Number.isFinite(num)) return { error: `${field.label} tidak valid` };
    return { value: num };
  }

  if (field.type === "select-enum") {
    if (!field.enumOptions?.includes(String(raw))) {
      return { error: `${field.label} tidak valid` };
    }
    return { value: String(raw) };
  }

  return { value: String(raw) };
}

export function validateFields(config: TableConfig, body: Record<string, unknown>) {
  const columns: string[] = [];
  const values: unknown[] = [];
  const errors: Record<string, string> = {};

  for (const field of config.fields) {
    const raw = body[field.name] ?? field.defaultValue;
    const { value, error } = coerceValue(field, raw);
    if (error) {
      errors[field.name] = error;
    } else {
      columns.push(field.name);
      values.push(value);
    }
  }

  return { columns, values, errors };
}
