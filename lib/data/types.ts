export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "datetime"
  | "select-enum"
  | "fk-select"
  | "file";

export type FieldConfig = {
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  colSpan?: 1 | 2;
  enumOptions?: readonly string[];
  fkTable?: string;
  defaultValue?: string | number;
};

export type TableConfig = {
  slug: string;
  table: string;
  label: string;
  description?: string;
  idColumn: string;
  optionLabelColumn?: string;
  fields: FieldConfig[];
};

export const STATUS_KEGIATAN_OPTIONS = [
  "akan_datang",
  "berlangsung",
  "selesai",
  "dibatalkan"
] as const;
