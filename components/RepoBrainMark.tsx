interface RepoBrainMarkProps {
  size?: number;
  isDark?: boolean;
}

export function RepoBrainMark({ size = 32, isDark = true }: RepoBrainMarkProps) {
  const orange = isDark ? "#FF6B35" : "#E65C00";
  const amber  = isDark ? "#FCA311" : "#FFB380";

  return (
    <svg
      width={size}
      height={size}
      viewBox="-46 -46 92 92"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="RepoBrain mark"
    >
      {/* outer hexagon */}
      <polygon points="0,-38 33,-19 33,19 0,38 -33,19 -33,-19"
        stroke={orange} strokeWidth="1.5" />

      {/* inner hexagon (faint) */}
      <polygon points="0,-26 22.5,-13 22.5,13 0,26 -22.5,13 -22.5,-13"
        stroke={orange} strokeWidth="0.5" opacity="0.4" />

      {/* node: left */}
      <circle cx="-18" cy="-8" r="4" fill={orange} />
      {/* node: right */}
      <circle cx="18"  cy="-8" r="4" fill={amber} />
      {/* node: bottom */}
      <circle cx="0"   cy="14" r="4" fill={orange} />
      {/* node: center */}
      <circle cx="0"   cy="-2" r="5" fill={orange} opacity="0.9" />

      {/* spokes from periphery nodes to center */}
      <line x1="-14" y1="-8" x2="-5" y2="-2"  stroke={orange} strokeWidth="1.2" />
      <line x1="14"  y1="-8" x2="5"  y2="-2"  stroke={amber}  strokeWidth="1.2" />
      <line x1="0"   y1="3"  x2="0"  y2="10"  stroke={orange} strokeWidth="1.2" />
      {/* horizontal connector between side nodes */}
      <line x1="-14" y1="-8" x2="14" y2="-8"  stroke={orange} strokeWidth="0.8" opacity="0.5" />

      {/* vertex tick lines */}
      <line x1="0"   y1="-38" x2="0"   y2="-28" stroke={orange} strokeWidth="1"   opacity="0.6" />
      <line x1="33"  y1="-19" x2="25"  y2="-14" stroke={amber}  strokeWidth="1"   opacity="0.5" />
      <line x1="33"  y1="19"  x2="25"  y2="14"  stroke={orange} strokeWidth="1"   opacity="0.5" />
      <line x1="-33" y1="-19" x2="-25" y2="-14" stroke={amber}  strokeWidth="1"   opacity="0.5" />

      {/* vertex accent dots */}
      <circle cx="0"   cy="-38" r="2.5" fill={amber}  opacity="0.8" />
      <circle cx="33"  cy="-19" r="2"   fill={orange} opacity="0.6" />
      <circle cx="-33" cy="19"  r="2"   fill={orange} opacity="0.6" />
    </svg>
  );
}
