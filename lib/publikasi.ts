import "server-only";

import client from "@/lib/db";

export async function ensurePenulis(email: string): Promise<number> {
  const normalized = email.trim().toLowerCase();
  const [row] = await client`
    INSERT INTO users (nama, email, password, role)
    VALUES (${normalized.split("@")[0] || "Admin"}, ${normalized}, '', 'admin')
    ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
    RETURNING id_user
  `;
  return row.id_user;
}