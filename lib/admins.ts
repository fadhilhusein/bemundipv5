import "server-only";

import client from "@/lib/db";
import { ensureBidangTable } from "@/lib/bidang";

const SEED_ADMIN_EMAIL = "bemundip2026@gmail.com";
const SEED_MASTER_EMAIL = "admin@gmail.com";

export type AdminRole = "admin" | "master" | "bidang";

export type AdminSession = {
  role: AdminRole;
  bidangId: number | null;
};

let adminsReady: Promise<void> | null = null;

export async function ensureAdminsTable(): Promise<void> {
  if (adminsReady) return adminsReady;

  adminsReady = (async () => {
    await ensureBidangTable();

    await client`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        role TEXT NOT NULL DEFAULT 'admin',
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `;

    await client`ALTER TABLE admins ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'admin'`;
    await client`ALTER TABLE admins ADD COLUMN IF NOT EXISTS bidang_id INTEGER REFERENCES bidang(id) ON DELETE CASCADE`;

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
  })().catch((err) => {
    adminsReady = null;
    throw err;
  });

  return adminsReady;
}

export async function getAdminSession(email: string | null | undefined): Promise<AdminSession | null> {
  if (!email) return null;

  await ensureAdminsTable();
  const rows = await client`SELECT role, bidang_id FROM admins WHERE email = ${email.toLowerCase()} LIMIT 1`;
  if (rows.length === 0) return null;
  return {
    role: (rows[0].role as AdminRole) ?? "admin",
    bidangId: rows[0].bidang_id ?? null
  };
}

export async function isAdminEmail(email: string | null | undefined) {
  return (await getAdminSession(email)) !== null;
}
