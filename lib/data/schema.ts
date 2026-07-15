import "server-only";

import client from "@/lib/db";
import { SCHEMA_STATEMENTS } from "@/lib/data/ddl";

let ready: Promise<void> | null = null;

async function runSchemaSetup() {
  for (const statement of SCHEMA_STATEMENTS) {
    await client.query(statement);
  }
}

export function ensureSchema() {
  if (!ready) {
    ready = runSchemaSetup().catch((err) => {
      ready = null;
      throw err;
    });
  }
  return ready;
}
