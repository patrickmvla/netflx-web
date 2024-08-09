import { z } from "zod";

const server = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "test", "production"]),
  NEXTAUTH_SECRET:
    process.env.NODE_ENV === "production"
      ? z.string().min(1)
      : z.string().min().optional(),
  NEXTAUTH_URL: z.preprocess(
    (str) => process.env.VERCEL_URL ?? str,
    process.env.VERCEL ? z.string().min(1) : z.string().url()
  ),
});

let env = /** @type {MergedOutput} */ (process.env);

env = new Proxy(parsed.data, {
  get(target, prop) {
    if (typeof prop !== "string") return undefined;
    // Throw a descriptive error if a server-side env var is accessed on the client
    // Otherwise it would just be returning `undefined` and be annoying to debug
    if (!isServer && !prop.startsWith("NEXT_PUBLIC_"))
      throw new Error(
        process.env.NODE_ENV === "production"
          ? "❌ Attempted to access a server-side environment variable on the client"
          : `❌ Attempted to access server-side environment variable '${prop}' on the client`
      );
    return target[/** @type {keyof typeof target} */ (prop)];
  },
});

export { env };
