import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma.db";

export const auth = betterAuth({
  appName: "next16-mvp",
  secret: process.env.BETTER_AUTH_SECRET ?? "G/nmSV2wfSmooYqk0qaQCcPgmQx0UqK1UUDYYxbEync=",
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies()],
});
