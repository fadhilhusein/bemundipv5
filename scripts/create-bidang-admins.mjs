import crypto from "node:crypto";
import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { neon } from "@neondatabase/serverless";

// Domain used for auto-generated bidang/biro login emails. Doesn't need to receive mail —
// Firebase email/password auth only requires a well-formed address, not a deliverable one.
const EMAIL_DOMAIN = "bemundip-internal.id";

const sql = neon(process.env.DATABASE_URL);

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")
  })
});
const auth = getAuth(app);

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "");
}

function generatePassword() {
  return crypto.randomBytes(9).toString("base64url");
}

async function ensureSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS bidang (
      id SERIAL PRIMARY KEY,
      nama_bidang TEXT NOT NULL,
      deskripsi TEXT NOT NULL,
      penanggung_jawab TEXT NOT NULL,
      jumlah_anggota INTEGER NOT NULL,
      gambar TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`ALTER TABLE admins ADD COLUMN IF NOT EXISTS bidang_id INTEGER REFERENCES bidang(id) ON DELETE CASCADE`;
}

async function main() {
  await ensureSchema();

  const bidangRows = await sql`SELECT id, nama_bidang FROM bidang ORDER BY id`;

  if (bidangRows.length === 0) {
    console.log("Tidak ada data di tabel bidang. Tambahkan data bidang/biro dulu lewat dashboard.");
    return;
  }

  const created = [];

  for (const row of bidangRows) {
    const existing = await sql`SELECT email FROM admins WHERE bidang_id = ${row.id} LIMIT 1`;
    if (existing.length > 0) {
      console.log(`[skip] "${row.nama_bidang}" sudah punya akun: ${existing[0].email}`);
      continue;
    }

    const slug = slugify(row.nama_bidang) || `bidang-${row.id}`;
    const email = `${slug}@${EMAIL_DOMAIN}`;
    const password = generatePassword();

    let firebaseUser = await auth.getUserByEmail(email).catch(() => null);
    if (!firebaseUser) {
      firebaseUser = await auth.createUser({ email, password, emailVerified: true });
    } else {
      await auth.updateUser(firebaseUser.uid, { password });
    }

    await sql`
      INSERT INTO admins (email, role, bidang_id)
      VALUES (${email}, 'bidang', ${row.id})
      ON CONFLICT (email) DO UPDATE SET role = 'bidang', bidang_id = ${row.id}
    `;

    created.push({ bidang: row.nama_bidang, email, password });
  }

  if (created.length === 0) {
    console.log("Tidak ada akun baru yang dibuat.");
    return;
  }

  console.log("\nAkun baru berhasil dibuat (simpan/kirim sekarang, password tidak akan ditampilkan lagi):\n");
  console.table(created);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
