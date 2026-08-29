import "server-only"

import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

/**
 * @deprecated Legacy custom JWT session (HS256 with SECRET_KEY).
 * Project now uses Firebase session cookies via `lib/auth.ts` + `lib/firebase/admin.ts`.
 * This file is kept only for backwards compatibility and will be removed.
 * Do NOT use for new code — use `requireSession()` / `requireMasterSession()`.
 */
const secretKey = process.env.SECRET_KEY;
const encodedKey = new TextEncoder().encode(secretKey);

//* Encrypt data
export async function encrypt(payload) {
    if (!secretKey) throw new Error("SECRET_KEY is not set");
    return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);
}

// backwards-compat alias for typo
export const ecnrypt = encrypt;

//* Decrypt the encrypt data
export async function decrypt(session) {
    try {
        const {payload} = await jwtVerify(session, encodedKey, {
            algorithms: ["HS256"],
        });
        return payload;
    } catch {
        console.log("Fail to decrypt session")
        return null;
    }
}

//* Making a session
export async function createSession(userId) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const session = await encrypt({ userId, expiresAt });
    const cookieStore = await cookies()

    cookieStore.set("user_session", session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: "lax",
        path: "/"
    })
}