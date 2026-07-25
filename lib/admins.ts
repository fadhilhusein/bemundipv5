import "server-only";

import client from "@/lib/db";

const SEED_ADMIN_EMAIL = "bemundip2026@gmail.com";
const SEED_MASTER_EMAIL = "admin@gmail.com";

export type AdminRole = "admin" | "master";

export async function ensureAdminsTable() {
  await client`
    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  await client`ALTER TABLE admins ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'admin'`;

  await client`
    INSERT INTO admins (email, role)
    VALUES (${SEED_ADMIN_EMAIL}, 'admin')
    ON CONFLICT (email) DO NOTHING
  `;

  await client`
    INSERT INTO admins (email, role)
    VALUES (${SEED_MASTER_EMAIL}, 'master')
    ON CONFLICT (email) DO UPDATE SET role = 'master'
  `;
}

export async function getAdminRole(email: string | null | undefined): Promise<AdminRole | null> {
  if (!email) return null;

  await ensureAdminsTable();
  const rows = await client`SELECT role FROM admins WHERE email = ${email.toLowerCase()} LIMIT 1`;
  if (rows.length === 0) return null;
  return (rows[0].role as AdminRole) ?? "admin";
}

export async function isAdminEmail(email: string | null | undefined) {
  return (await getAdminRole(email)) !== null;
}
