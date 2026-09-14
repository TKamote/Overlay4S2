/** Set 5 balls: Classic PNG (1–10) + Stream Edge ring/shine; SVG fallback for 11–15. */

import Image from "next/image";

const STREAM_EDGE_SOLID: Record<number, string> = {
  1: "#E6C200",
  2: "#1565C0",
  3: "#C62828",
  4: "#AD1457",
  5: "#512DA8",
  6: "#2E7D32",
  7: "#5D4037",
  8: "#000000",
  9: "#E6A800",
  10: "#0D47A1",
  11: "#B71C1C",
  12: "#6A1B9A",
  13: "#EF6C00",
  14: "#1B5E20",
  15: "#3E2723",
};

function clampBall(n: number): number {
  return Math.min(15, Math.max(1, Math.round(n)));
}

function isStripe(n: number) {
  return n >= 9 && n <= 15;
}

function pocketedClass(pocketed: boolean, className: string): string {
  return `shrink-0 ${pocketed ? "opacity-20" : ""} ${className}`.trim();
}

type PoolBallProps = {
  number: number;
  size?: number;
  pocketed?: boolean;
  className?: string;
};

/** Stream Edge SVG used for balls 11–15 (no Classic PNG). */
function StreamEdgeFallback({
  number,
  size,
  pocketed,
  className,
}: {
  number: number;
  size: number;
  pocketed: boolean;
  className: string;
}) {
  const n = clampBall(number);
  const color = STREAM_EDGE_SOLID[n] ?? "#888888";
  const stripe = isStripe(n);
  const id = `stream-${n}-${size}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={pocketedClass(pocketed, className)}
      aria-label={`Ball ${n}`}
      role="img"
    >
      <defs>
        <clipPath id={`${id}-clip`}>
          <circle cx="32" cy="32" r="30" />
        </clipPath>
      </defs>
      <circle cx="32" cy="32" r="30" fill={stripe ? "#E0E0E0" : color} />
      {stripe && (
        <g clipPath={`url(#${id}-clip)`}>
          <rect x="0" y="20" width="64" height="24" fill={color} />
        </g>
      )}
      <circle cx="32" cy="32" r="11" fill="#F5F5F5" />
      <text
        x="32"
        y="32"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#111"
        fontSize={n >= 10 ? 13 : 15}
        fontWeight="700"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        {n}
      </text>
      <circle cx="32" cy="32" r="29" fill="none" stroke="#0d0d0d" strokeWidth="2.5" />
      <circle cx="22" cy="22" r="4" fill="#ffffff" opacity="0.65" />
    </svg>
  );
}

/**
 * Set 5 rack ball — Classic PNG for 1–10 with Stream Edge ring/shine;
 * Stream Edge SVG for 11–15.
 */
export default function PoolBall({
  number,
  size = 44,
  pocketed = false,
  className = "",
}: PoolBallProps) {
  const n = clampBall(number);

  if (n > 10) {
    return (
      <StreamEdgeFallback
        number={n}
        size={size}
        pocketed={pocketed}
        className={className}
      />
    );
  }

  return (
    <span
      className={pocketedClass(
        pocketed,
        `relative inline-block shrink-0 ${className}`
      )}
      style={{ width: size, height: size }}
      aria-label={`Ball ${n}`}
      role="img"
    >
      <Image
        src={`/ballicons/ball-${n}.png`}
        alt=""
        width={size}
        height={size}
        className="h-full w-full object-contain"
        unoptimized
      />
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 64 64"
        aria-hidden
      >
        <circle cx="32" cy="32" r="29" fill="none" stroke="#0d0d0d" strokeWidth="2.5" />
        <circle cx="22" cy="22" r="4" fill="#ffffff" opacity="0.65" />
      </svg>
    </span>
  );
}

export const SOLIDS = [1, 2, 3, 4, 5, 6, 7] as const;
export const STRIPES = [9, 10, 11, 12, 13, 14, 15] as const;
