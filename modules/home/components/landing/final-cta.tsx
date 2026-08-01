import { Zap, ArrowRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { getC, mono, sans, Tag, FadeUp } from "./landing-theme";

export function FinalCTA({ onEnterApp, isDark }: { onEnterApp: () => void; isDark: boolean }) {
  const C = getC(isDark);
  return (
    <section style={{ padding: "120px 24px", textAlign: "center", position: "relative", overflow: "hidden", borderTop: `1px solid ${C.BORDER}` }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 400, background: `radial-gradient(ellipse, ${C.ORANGE}${isDark ? "12" : "08"} 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 680, margin: "0 auto", position: "relative" }}>
        <FadeUp>
          <Tag color={C.ORANGE}><Zap size={10} /> Get started now</Tag>
          <h2 style={{ ...sans, fontSize: "clamp(32px, 5vw, 60px)", fontWeight: 800, letterSpacing: "-0.03em", color: C.TEXT, margin: "24px 0 20px", lineHeight: 1.08 }}>
            Ready to understand<br />your codebase?
          </h2>
          <p style={{ ...sans, fontSize: 18, color: C.MUTED, lineHeight: 1.65, margin: "0 0 40px" }}>
            Join 12,400+ engineers who use RepoBrain to navigate unfamiliar code, catch bugs early, and onboard in days instead of months.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              onClick={onEnterApp}
              size="lg"
              className="gap-2 rounded-xl text-base font-bold px-9 py-4 h-auto hover:-translate-y-0.5 transition-transform"
              style={{ background: C.ORANGE, color: "#fff", boxShadow: `0 12px 40px ${C.ORANGE}38` }}
            >
              Start for free <ArrowRight size={16} />
            </Button>
            <Button
              onClick={onEnterApp}
              variant="outline"
              size="lg"
              className="rounded-xl text-base font-medium px-[30px] py-4 h-auto"
              style={{ borderColor: C.BORDER, color: C.TEXT, background: "transparent" }}
            >
              Book a demo
            </Button>
          </div>
          <p style={{ ...mono, fontSize: 12, color: C.MUTED, marginTop: 20, opacity: 0.7 }}>No credit card required · Cancel anytime · SOC 2 Type II</p>
        </FadeUp>
      </div>
    </section>
  );
}
