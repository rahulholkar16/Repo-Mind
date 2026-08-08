"use client";

import { ReactNode } from "react";
import { useSession } from "@/lib/auth-client";

export function AuthLayer({ children }: { children: ReactNode }) {
  const { isPending } = useSession();

  if (isPending)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="size-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return <>{children}</>;
}
