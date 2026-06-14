import { useEffect } from "react";
import { getC } from "./landing/landing-theme";
import { Nav } from "./landing/nav";
import { Hero } from "./landing/hero";
import { LogoStrip } from "./landing/logo-strip";
import { Features } from "./landing/features";
import { HowItWorks } from "./landing/how-it-works";
import { Testimonials } from "./landing/testimonials";
import { FinalCTA } from "./landing/final-cta";
import { Footer } from "./landing/footer";

interface Props {
  onEnterApp: () => void;
  isDark: boolean;
  setIsDark: (v: boolean) => void;
}

export function LandingPage({ onEnterApp, isDark, setIsDark }: Props) {
  const C = getC(isDark);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <div style={{ background: C.BG, color: C.TEXT, fontFamily: "'Inter', sans-serif", overflowX: "hidden", transition: "background 0.3s, color 0.3s" }}>
      <style>{`
        @media (max-width: 900px) {
          .hero-grid         { grid-template-columns: 1fr !important; gap: 44px !important; }
          .bento-grid        { grid-template-columns: 1fr !important; }
          .bento-wide        { grid-column: 1 !important; }
          .steps-grid        { grid-template-columns: 1fr !important; gap: 40px !important; }
          .testimonials-grid { grid-template-columns: 1fr !important; }
          .footer-grid       { grid-template-columns: 1fr 1fr !important; }
          .hidden-mobile     { display: none !important; }
          .show-mobile       { display: flex !important; }
          .hide-on-small     { display: none !important; }
          .feature-card-inner{ flex-direction: column !important; gap: 16px !important; }
        }
        @media (max-width: 580px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
        .hidden-mobile { display: flex; }
        .show-mobile   { display: none; }
      `}</style>

      <Nav       onEnterApp={onEnterApp} isDark={isDark} setIsDark={setIsDark} />
      <Hero      onEnterApp={onEnterApp} isDark={isDark} />
      <LogoStrip isDark={isDark} />
      <Features  isDark={isDark} />
      <HowItWorks isDark={isDark} />
      <Testimonials isDark={isDark} />
      <FinalCTA  onEnterApp={onEnterApp} isDark={isDark} />
      <Footer    isDark={isDark} />
    </div>
  );
}
