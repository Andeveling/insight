"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function SessionActions() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      await authClient.signOut();
      router.refresh();
    });
  };

  return (
    <div className="flex justify-center">
      <Button
        variant="outline"
        type="button"
        onClick={handleSignOut}
        disabled={isPending}
      >
        {isPending ? "Cerrando..." : "Cerrar sesión"}
      </Button>
    </div>
  );
}
