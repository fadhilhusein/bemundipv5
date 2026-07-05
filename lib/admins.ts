import "server-only";

import client from "@/lib/db";

const SEED_ADMIN_EMAIL = "bemundip2026@gmail.com";

export async function ensureAdminsTable() {
  await client`
    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  await client`
    INSERT INTO admins (email)
    VALUES (${SEED_ADMIN_EMAIL})
    ON CONFLICT (email) DO NOTHING
  `;
}

export async function isAdminEmail(email: string | null | undefined) {
  if (!email) return false;

  await ensureAdminsTable();
  const rows = await client`SELECT 1 FROM admins WHERE email = ${email.toLowerCase()} LIMIT 1`;
  return rows.length > 0;
}
