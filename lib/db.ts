import { neon } from "@neondatabase/serverless";

const client = neon(process.env.DATABASE_URL!);

export default client;
