/** Classic PNG pool balls (1–10); simple SVG stripe fallback for 11–15. */

import Image from "next/image";

const STRIPE_COLORS: Record<number, string> = {
  11: "#B71C1C",
  12: "#6A1B9A",
  13: "#EF6C00",
  14: "#1B5E20",
  15: "#3E2723",
};

function clampBall(n: number): number {
  return Math.min(15, Math.max(1, Math.round(n)));
}

type PoolBallProps = {
  number: number;
  size?: number;
  pocketed?: boolean;
  className?: string;
};

export default function PoolBall({
  number,
  size = 44,
  pocketed = false,
  className = "",
}: PoolBallProps) {
  const n = clampBall(number);
  const pocketedCls = `shrink-0 ${pocketed ? "opacity-20" : ""} ${className}`.trim();

  if (n <= 10) {
    return (
      <Image
        src={`/ballicons/ball-${n}.png`}
        alt={`Ball ${n}`}
        width={size}
        height={size}
        className={`${pocketedCls} object-contain`}
        unoptimized
      />
    );
  }

  const color = STRIPE_COLORS[n] ?? "#888";
  const id = `classic-stripe-${n}-${size}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={pocketedCls}
      aria-label={`Ball ${n}`}
      role="img"
    >
      <defs>
        <clipPath id={`${id}-clip`}>
          <circle cx="32" cy="32" r="30" />
        </clipPath>
      </defs>
      <circle cx="32" cy="32" r="30" fill="#F5F5F5" />
      <g clipPath={`url(#${id}-clip)`}>
        <rect x="0" y="20" width="64" height="24" fill={color} />
      </g>
      <circle cx="32" cy="32" r="11" fill="#F8F8F8" />
      <text
        x="32"
        y="32"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#111"
        fontSize={14}
        fontWeight="700"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        {n}
      </text>
    </svg>
  );
}

export const SOLIDS = [1, 2, 3, 4, 5, 6, 7] as const;
export const STRIPES = [9, 10, 11, 12, 13, 14, 15] as const;
