import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LoginForm } from "./_components/login-form";

async function AuthCheck() {
  await connection();

  const session = await auth.api.getSession({
    headers: new Headers(),
  });

  if (session) {
    redirect("/dashboard");
  }

  return null;
}

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <Suspense fallback={null}>
          <AuthCheck />
        </Suspense>
        <LoginForm />
      </div>
    </div>
  );
} 
