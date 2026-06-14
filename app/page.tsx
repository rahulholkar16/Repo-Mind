"use client";

import { useRouter } from "next/navigation";
import { LandingPage } from "@/modules/home";
import { useRootContext } from "@/components/RootContext";

export default function Home() {
  const router = useRouter();
  const { isDark, setIsDark } = useRootContext();

  return (
    <LandingPage
      onEnterApp={() => router.push("/dashboard")}
      isDark={isDark}
      setIsDark={setIsDark}
    />
  );
}
