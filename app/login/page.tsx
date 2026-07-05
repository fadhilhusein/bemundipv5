"use client";

import { FirebaseError } from "firebase/app";
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { getFirebaseAuth } from "@/lib/firebase/client";

const errorMessages: Record<string, string> = {
  "auth/invalid-credential": "Email atau kata sandi salah.",
  "auth/wrong-password": "Email atau kata sandi salah.",
  "auth/user-not-found": "Akun dengan email tersebut tidak ditemukan.",
  "auth/invalid-email": "Format email tidak valid.",
  "auth/too-many-requests": "Terlalu banyak percobaan. Coba lagi beberapa saat lagi.",
  "auth/popup-closed-by-user": "Jendela login ditutup sebelum selesai.",
  "auth/network-request-failed": "Koneksi bermasalah. Periksa jaringan Anda."
};

function mapLoginError(error: unknown) {
  if (error instanceof FirebaseError) {
    return errorMessages[error.code] ?? "Gagal masuk. Silakan coba lagi.";
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "Gagal masuk. Silakan coba lagi.";
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (searchParams.get("error") === "forbidden") {
      setError("Akun ini tidak memiliki akses admin.");
    }
  }, [searchParams]);

  const exchangeForSessionCookie = async (idToken: string) => {
    const res = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken })
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new Error(body?.error ?? "Gagal membuat sesi");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const credential = await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
      const idToken = await credential.user.getIdToken();
      await exchangeForSessionCookie(idToken);
      router.push("/dashboard");
    } catch (err) {
      setError(mapLoginError(err));
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      const credential = await signInWithPopup(getFirebaseAuth(), new GoogleAuthProvider());
      const idToken = await credential.user.getIdToken();
      await exchangeForSessionCookie(idToken);
      router.push("/dashboard");
    } catch (err) {
      setError(mapLoginError(err));
      setIsSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center bg-brown px-6 py-16 text-white sm:px-10 lg:px-16">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="inline-flex items-center gap-3 focus-visible:rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            aria-label="Kembali ke beranda"
          >
            <Image
              src="/assets/bemundip.png"
              alt="Kabinet Universitas Diponegoro"
              width={58}
              height={44}
              className="h-10 w-auto object-contain"
            />
            <span className="text-sm font-semibold tracking-wide">BEM UNDIP</span>
          </Link>

          <h1 className="font-display mt-10 text-4xl font-medium leading-tight">
            Masuk ke akun Anda
          </h1>
          <p className="mt-3 text-sm text-peach/90">
            Khusus untuk pengurus dan anggota Kabinet BEM UNDIP 2026.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-6">
            <div>
              <label htmlFor="email" className="text-sm font-semibold">
                Alamat email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 h-[52px] w-full rounded-full bg-white/10 px-6 text-sm text-white outline-none ring-1 ring-white/20 placeholder:text-white/40 focus:ring-2 focus:ring-orange"
                placeholder="nama@undip.ac.id"
              />
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-semibold">
                Kata sandi
              </label>
              <div className="relative mt-2">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-[52px] w-full rounded-full bg-white/10 px-6 pr-14 text-sm text-white outline-none ring-1 ring-white/20 placeholder:text-white/40 focus:ring-2 focus:ring-orange"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  className="absolute inset-y-0 right-5 flex items-center text-white/60 transition hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-white/85">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/30 bg-white/10 accent-orange"
                />
                Ingat saya
              </label>
              <Link href="#" className="font-semibold text-peach hover:text-white">
                Lupa kata sandi?
              </Link>
            </div>

            {error ? (
              <p role="alert" className="text-sm font-semibold text-[#ff8b7a]">
                {error}
              </p>
            ) : null}

            <Button className="w-full justify-center" disabled={isSubmitting}>
              {isSubmitting ? "Memproses…" : "Masuk"}
            </Button>
          </form>

          <div className="mt-8 flex items-center gap-4 text-xs uppercase tracking-wide text-white/50">
            <span className="h-px flex-1 bg-white/20" />
            Atau lanjutkan dengan
            <span className="h-px flex-1 bg-white/20" />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white/10 text-sm font-semibold text-white ring-1 ring-white/20 transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.56 2.7-3.87 2.7-6.62Z"
                />
                <path
                  fill="#34A853"
                  d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.83.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.9v2.33A9 9 0 0 0 9 18Z"
                />
                <path
                  fill="#FBBC05"
                  d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.9A9 9 0 0 0 0 9c0 1.45.35 2.83.9 4.03l3.05-2.33Z"
                />
                <path
                  fill="#EA4335"
                  d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.9 11.43 0 9 0A9 9 0 0 0 .9 4.97l3.05 2.33C4.66 5.17 6.65 3.58 9 3.58Z"
                />
              </svg>
              Google
            </button>
            <button
              type="button"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white/10 text-sm font-semibold text-white ring-1 ring-white/20 transition hover:bg-white/20"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 .5C5.73.5.98 5.24.98 11.52c0 5.02 3.26 9.28 7.77 10.78.57.1.78-.25.78-.55v-1.94c-3.16.69-3.83-1.52-3.83-1.52-.52-1.31-1.26-1.66-1.26-1.66-1.03-.7.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.01 1.74 2.66 1.24 3.31.95.1-.73.4-1.24.72-1.53-2.52-.29-5.17-1.26-5.17-5.6 0-1.24.44-2.24 1.17-3.03-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.14 1.16a10.9 10.9 0 0 1 5.72 0c2.18-1.47 3.14-1.16 3.14-1.16.62 1.59.23 2.76.11 3.05.73.79 1.17 1.79 1.17 3.03 0 4.35-2.65 5.31-5.18 5.59.41.35.77 1.04.77 2.1v3.11c0 .3.21.66.79.55A11.53 11.53 0 0 0 23.02 11.5C23.02 5.24 18.27.5 12 .5Z" />
              </svg>
              GitHub
            </button>
          </div>
        </div>
      </div>

      <div className="relative hidden lg:block">
        <Image
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600&auto=format&fit=crop"
          alt=""
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brown/50 via-transparent to-transparent" />
      </div>
    </main>
  );
}
