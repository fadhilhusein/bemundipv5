import { type NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { getAdminBucket } from "@/lib/firebase/admin";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-100);
}

export async function POST(request: NextRequest) {
  if (!(await requireSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const folder = String(formData.get("folder") ?? "uploads").replace(/[^a-zA-Z0-9_-]/g, "");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "Ukuran file maksimal 5MB" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Tipe file tidak didukung" }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const destPath = `${folder || "uploads"}/${crypto.randomUUID()}-${sanitizeFilename(file.name)}`;

  const bucket = getAdminBucket();
  const bucketFile = bucket.file(destPath);
  await bucketFile.save(bytes, { contentType: file.type, public: true });
  await bucketFile.makePublic();

  const url = `https://storage.googleapis.com/${bucket.name}/${destPath}`;

  return NextResponse.json({ url }, { status: 201 });
}
