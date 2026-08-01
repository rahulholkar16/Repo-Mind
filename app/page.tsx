"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { LandingPage } from "@/modules/home";

export default function Home() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  const isDark = resolvedTheme ? resolvedTheme === "dark" : true;

  return (
    <LandingPage
      onEnterApp={() => router.push("/dashboard")}
      isDark={isDark}
      setIsDark={(v) => setTheme(v ? "dark" : "light")}
    />
  );
}
