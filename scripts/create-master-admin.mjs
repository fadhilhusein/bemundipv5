import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const EMAIL = "admin@gmail.com";
const PASSWORD = "AnaConda76";

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")
  })
});

const auth = getAuth(app);

async function main() {
  const existing = await auth.getUserByEmail(EMAIL).catch(() => null);

  if (existing) {
    console.log(`Firebase user ${EMAIL} already exists (uid=${existing.uid}), skipping create.`);
    return;
  }

  try {
    const user = await auth.createUser({ email: EMAIL, password: PASSWORD, emailVerified: true });
    console.log(`Created Firebase user ${EMAIL} (uid=${user.uid}).`);
  } catch (err) {
    if (err.code === "auth/email-already-exists") {
      console.log(`Firebase user ${EMAIL} already exists, skipping.`);
      return;
    }
    throw err;
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
