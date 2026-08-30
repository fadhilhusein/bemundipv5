import { neon } from "@neondatabase/serverless";
import { SCHEMA_STATEMENTS } from "../lib/data/ddl.ts";

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("DATABASE_URL environment variable is missing.");
  process.exit(1);
}

const client = neon(dbUrl);

async function migrate() {
  console.log("Menjalankan migrasi database ke Neon...");
  for (let i = 0; i < SCHEMA_STATEMENTS.length; i++) {
    const stmt = SCHEMA_STATEMENTS[i];
    try {
      await client.query(stmt);
      console.log(`[${i + 1}/${SCHEMA_STATEMENTS.length}] OK`);
    } catch (err) {
      console.error(`Gagal pada statement index ${i}:`, err);
      throw err;
    }
  }
  console.log("Migrasi database selesai dengan sukses.");
}

migrate()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
