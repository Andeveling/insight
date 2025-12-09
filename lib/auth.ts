import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { cache } from "react";
import { prisma } from "@/lib/prisma.db";

export const auth = betterAuth({
  appName: "next16-mvp",
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret:
    process.env.BETTER_AUTH_SECRET ??
    "G/nmSV2wfSmooYqk0qaQCcPgmQx0UqK1UUDYYxbEync=",
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [ nextCookies() ],
});

/**
 * Cached session getter - deduplicates calls within the same request
 * Use this instead of auth.api.getSession directly in Server Components
 */
export const getSession = cache(async () => {
  return auth.api.getSession({
    headers: await headers(),
  });
});
