"use client";
import { FirebaseError } from "firebase/app";
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Suspense, useEffect, useRef, useState } from "react";
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
    return (<Suspense fallback={null}>
      <LoginForm />
    </Suspense>);
}
function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const busyRef = useRef(false);
    const [method, setMethod] = useState<"email" | "google">("email");
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
        if (busyRef.current)
            return;
        busyRef.current = true;
        setMethod("email");
        setError(null);
        setIsSubmitting(true);
        try {
            const credential = await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
            const idToken = await credential.user.getIdToken();
            await exchangeForSessionCookie(idToken);
            router.push("/dashboard");
        }
        catch (err) {
            setError(mapLoginError(err));
            setIsSubmitting(false);
            busyRef.current = false;
        }
    };
    const handleGoogleSignIn = async () => {
        if (busyRef.current)
            return;
        busyRef.current = true;
        setMethod("google");
        setError(null);
        setIsSubmitting(true);
        try {
            const credential = await signInWithPopup(getFirebaseAuth(), new GoogleAuthProvider());
            const idToken = await credential.user.getIdToken();
            await exchangeForSessionCookie(idToken);
            router.push("/dashboard");
        }
        catch (err) {
            setError(mapLoginError(err));
            setIsSubmitting(false);
            busyRef.current = false;
        }
    };
    return <main className="admin-theme admin-login">
    <section className="admin-login-form"><div className="w-full max-w-[440px]">
      <Link href="/" className="inline-flex min-h-11 items-center gap-3" aria-label="Kembali ke beranda"><Image src="/assets/logo-bem.webp" alt="Logo BEM UNDIP" width={52} height={52}/><span className="font-semibold">BEM UNDIP<span className="block admin-muted text-[13px] font-normal">Kabinet Dipanegara 2026</span></span></Link>
      <h1 className="admin-login-heading mt-10">Masuk ke ruang pengelola</h1><p className="admin-muted mt-3">Khusus pengurus dan anggota Kabinet BEM UNDIP 2026.</p>
      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5" aria-busy={isSubmitting} aria-describedby={error ? "login-error" : undefined}>
        <div><label htmlFor="email">Alamat email</label><input id="email" className="admin-input mt-2" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="nama@undip.ac.id" disabled={isSubmitting}/></div>
        <div><label htmlFor="password">Kata sandi</label><div className="relative mt-2"><input id="password" className="admin-input pr-14" type={showPassword ? "text" : "password"} autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} disabled={isSubmitting}/><button type="button" onClick={() => setShowPassword(v => !v)} aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"} aria-pressed={showPassword} className="admin-icon-button absolute right-0.5 top-0.5">{showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}</button></div></div>
        {error && <p id="login-error" role="alert" className="admin-alert">{error}</p>}<Button appearance="admin" disabled={isSubmitting}>{isSubmitting && method === "email" ? "Memproses..." : "Masuk"}</Button>
      </form>
      <div className="my-6 flex items-center gap-4 admin-muted text-[13px]"><span className="h-px flex-1 bg-line"/>atau<span className="h-px flex-1 bg-line"/></div>
      <Button appearance="admin" variant="secondary" type="button" onClick={handleGoogleSignIn} disabled={isSubmitting} className="w-full"><span aria-hidden="true" className="text-lg font-bold">G</span>{isSubmitting && method === "google" ? "Menghubungkan Google..." : "Masuk dengan Google"}</Button><Link href="/" className="mt-6 inline-flex min-h-11 items-center text-sm font-medium">Kembali ke beranda</Link>
    </div></section>
    <aside className="admin-login-brand"><div className="max-w-[560px]"><p className="text-sm font-medium text-[#FDBA8C]">RUANG PENGELOLA BEM UNDIP</p><h2 className="mt-5 text-[clamp(32px,3vw,48px)] leading-tight">Beri Rasa,<br />Lahir Makna.</h2><p className="mt-5 max-w-[45ch] text-[#D0D5DD]">Kelola informasi, kegiatan, dan layanan dalam satu ruang kerja bersama.</p><Image src="/assets/hero_image.webp" alt="" width={755} height={627} className="mt-10 h-auto w-full object-contain" priority/></div></aside>
  </main>;
}
