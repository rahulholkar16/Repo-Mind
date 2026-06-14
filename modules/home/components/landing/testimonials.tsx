import { Star } from "lucide-react";
import { getC, mono, sans, Tag, FadeUp } from "./landing-theme";

const TESTIMONIALS = [
  { name: "Sarah Chen",   role: "Staff Eng, Stripe",       avatar: "SC", color: "#3B82F6", quote: "RepoBrain saved our team 3 weeks of onboarding when we acquired a startup. It mapped the entire 180k-line codebase before our first all-hands." },
  { name: "Marcus Webb",  role: "CTO, Oxide Computer",     avatar: "MW", color: "#10B981", quote: "I was skeptical, but after running it on our Rust codebase it found a subtle lifetime issue in the kernel driver that our own team had missed for months." },
  { name: "Priya Sharma", role: "Principal Eng, Linear",   avatar: "PS", color: "#8B5CF6", quote: "The PR review feature alone is worth it. It catches missing error handling cases that reviewers skim over because they're focused on the happy path." },
  { name: "James Liu",    role: "Dev Advocate, Vercel",    avatar: "JL", color: "#FF6B35", quote: "I use it every day to understand open-source code. Instead of spending 20 minutes tracing call stacks, I just ask and get the answer in 10 seconds." },
];

export function Testimonials({ isDark }: { isDark: boolean }) {
  const C = getC(isDark);
  return (
    <section style={{ padding: "100px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <FadeUp>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <Tag color={C.AMBER}><Star size={10} /> Testimonials</Tag>
            <h2 style={{ ...sans, fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 700, letterSpacing: "-0.025em", color: C.TEXT, margin: "20px 0 0" }}>
              Loved by engineers<br />at top companies
            </h2>
          </div>
        </FadeUp>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }} className="testimonials-grid">
          {TESTIMONIALS.map((t, i) => (
            <FadeUp key={t.name} delay={i * 0.08}>
              <div style={{ background: C.SURFACE, border: `1px solid ${C.BORDER}`, borderRadius: 20, padding: "28px 30px", height: "100%", transition: "border-color 0.2s, box-shadow 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = isDark ? "#3a3a3a" : "#ccc"; e.currentTarget.style.boxShadow = isDark ? "none" : "0 8px 32px rgba(0,0,0,0.06)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.BORDER; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ ...sans, fontSize: 36, color: `${t.color}40`, lineHeight: 1, marginBottom: 12, fontWeight: 800 }}>&ldquo;</div>
                <p style={{ ...sans, fontSize: 15, color: isDark ? "#e2e8f0" : C.TEXT, lineHeight: 1.7, margin: "0 0 24px" }}>{t.quote}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: `${t.color}20`, border: `1px solid ${t.color}40`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ ...mono, fontSize: 11, fontWeight: 600, color: t.color }}>{t.avatar}</span>
                  </div>
                  <div>
                    <div style={{ ...sans, fontSize: 14, fontWeight: 600, color: C.TEXT }}>{t.name}</div>
                    <div style={{ ...sans, fontSize: 12, color: C.MUTED }}>{t.role}</div>
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
