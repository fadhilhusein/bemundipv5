// Deletes the dummy rows recorded in manifest.json by `npm run dummy:seed`.
// A row is deleted only when both its id and its title still match the manifest,
// so real data entered later is never touched.
import { existsSync, readFileSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";

const MANIFEST_PATH = join(dirname(fileURLToPath(import.meta.url)), "manifest.json");

const TABLES = {
  publikasi_terkini: { idColumn: "id_publikasi", titleColumn: "judul_publikasi" },
  agenda: { idColumn: "id_agenda", titleColumn: "judul_agenda" },
  layanan: { idColumn: "id_layanan", titleColumn: "nama_layanan" },
  program_unggulan: { idColumn: "id_program", titleColumn: "nama_program" },
  media_sosial: { idColumn: "id_sosmed", titleColumn: "platform" }
};

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL belum diatur.");
  process.exit(1);
}
if (!existsSync(MANIFEST_PATH)) {
  console.log("Tidak ada data dummy yang tercatat (manifest.json tidak ditemukan). Tidak ada yang dihapus.");
  process.exit(0);
}

const sql = neon(process.env.DATABASE_URL);
const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));

const queries = [];
const labels = [];
for (const [table, rows] of Object.entries(manifest.tables ?? {})) {
  const config = TABLES[table];
  if (!config) throw new Error(`Tabel tidak dikenal di manifest: ${table}`);
  for (const row of rows) {
    queries.push(
      sql.query(`DELETE FROM ${table} WHERE ${config.idColumn} = $1 AND ${config.titleColumn} = $2 RETURNING ${config.idColumn}`, [
        row.id,
        row.title
      ])
    );
    labels.push(table);
  }
}

const results = await sql.transaction(queries);

const summary = {};
results.forEach((deleted, index) => {
  const table = labels[index];
  summary[table] ??= { tercatat: 0, dihapus: 0 };
  summary[table].tercatat += 1;
  summary[table].dihapus += deleted.length;
});

unlinkSync(MANIFEST_PATH);
console.log("Data dummy dihapus:");
console.table(summary);
console.log("Baris yang sudah diubah judulnya atau sudah dihapus manual dilewati. Data asli tidak tersentuh.");
