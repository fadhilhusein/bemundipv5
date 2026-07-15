import crypto from "node:crypto";
import { type NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

export async function POST(request: NextRequest) {
  if (!(await requireSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ error: "Konfigurasi penyimpanan gambar belum diatur" }, { status: 500 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const folder = String(formData.get("folder") ?? "uploads").replace(/[^a-zA-Z0-9_-]/g, "") || "uploads";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "Ukuran file maksimal 5MB" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Tipe file tidak didukung" }, { status: 400 });
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signaturePayload = `folder=bemundip/${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash("sha1").update(signaturePayload).digest("hex");

  const uploadForm = new FormData();
  uploadForm.append("file", file);
  uploadForm.append("api_key", apiKey);
  uploadForm.append("timestamp", String(timestamp));
  uploadForm.append("signature", signature);
  uploadForm.append("folder", `bemundip/${folder}`);

  const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: uploadForm
  });

  if (!cloudinaryRes.ok) {
    const errJson = await cloudinaryRes.json().catch(() => null);
    return NextResponse.json(
      { error: errJson?.error?.message ?? "Upload gagal" },
      { status: 502 }
    );
  }

  const data = await cloudinaryRes.json();
  return NextResponse.json({ url: data.secure_url }, { status: 201 });
}
