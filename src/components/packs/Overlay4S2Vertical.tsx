"use client";

import { type ReactNode } from "react";
import Image from "next/image";
import PoolBall from "@/components/PoolBall";
import { BallResetButton, CreatorOverlayModals } from "@/components/creator-vertical/CreatorOverlayModals";
import { VerticalRaceCell } from "@/components/creator-vertical/VerticalRaceCell";
import { VerticalStage } from "@/components/creator-vertical/VerticalStage";
import { useOverlayMatch, placeholderFor } from "@/hooks/useOverlayMatch";
import {
  BAR_H,
  PHOTO_BUTTON_BASE,
  PHOTO_PX,
  PLAYER_NAME_CLASS,
  SCORE_CELL_CLASS,
} from "@/lib/creatorVerticalSpacing";

const FOLD_RED =
  "linear-gradient(to bottom, #E23A4A 0%, #E23A4A 48%, #B81E2E 52%, #B81E2E 100%)";
const FOLD_BLUE =
  "linear-gradient(to bottom, #3B6FCF 0%, #3B6FCF 48%, #1A4A9A 52%, #1A4A9A 100%)";

const FoldedBar = ({
  side,
  children,
  className = "",
}: {
  side: "red" | "blue";
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={`relative flex min-w-0 flex-1 items-center overflow-visible ${className}`}
    style={{
      height: BAR_H,
      background: side === "red" ? FOLD_RED : FOLD_BLUE,
    }}
  >
    <div
      className="pointer-events-none absolute inset-x-0 top-1/2 z-[1] h-px -translate-y-1/2"
      style={{
        background:
          "linear-gradient(to right, transparent, rgba(255,255,255,0.35), rgba(0,0,0,0.25), transparent)",
      }}
    />
    <div className="relative z-[2] flex h-full w-full items-center">{children}</div>
  </div>
);

/** Overlay4S2 vertical (red/blue Creator Overlay 4). */
export default function Overlay4S2Vertical({ matchId }: { matchId: string }) {
  const m = useOverlayMatch({
    matchId,
    enableBalls: true,
    rackStyle: "full",
    defaultRaceTo: 10,
  });
  const { canEdit } = m;

  const photoClass = `${PHOTO_BUTTON_BASE} self-end rounded-[20%] border border-white/40 shadow-md ${
    canEdit ? "cursor-pointer hover:opacity-90" : "cursor-default"
  }`;

  const nameClass = `flex h-full min-w-0 flex-1 items-center px-1 uppercase tracking-wide ${
    canEdit ? "cursor-pointer hover:opacity-90" : "cursor-default"
  }`;

  return (
    <VerticalStage>
      <div className="absolute bottom-[15px] left-1/2 flex w-[980px] max-w-[calc(100%-48px)] -translate-x-1/2 flex-col overflow-visible">
        <div
          className="relative flex w-full items-end overflow-visible"
          style={{ minHeight: PHOTO_PX }}
        >
          <div className="flex w-full items-stretch overflow-visible">
            <FoldedBar side="red" className="rounded-l-sm pl-1">
              <button
                type="button"
                onClick={() => canEdit && m.setShowPlayer1Modal(true)}
                className={photoClass}
                style={{ width: PHOTO_PX, height: PHOTO_PX, marginLeft: 4 }}
                title={canEdit ? "Select Player A" : undefined}
              >
                <Image
                  src={m.getPlayer1Photo() || placeholderFor(m.player1, "player1")}
                  alt={m.getPlayer1Name()}
                  width={PHOTO_PX}
                  height={PHOTO_PX}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              </button>
              <button
                type="button"
                onClick={() => canEdit && m.setShowPlayer1Modal(true)}
                className={`${nameClass} justify-start text-left`}
              >
                <div className={`${PLAYER_NAME_CLASS} text-[40px]`}>{m.getPlayer1Name()}</div>
              </button>
              <div className={`${SCORE_CELL_CLASS} w-14 text-[47px]`}>{m.player1Score}</div>
            </FoldedBar>

            <div
              className="relative z-[3] flex shrink-0 items-center justify-center bg-white px-1 shadow-sm"
              style={{ height: BAR_H, width: 88 }}
            >
              <VerticalRaceCell
                m={m}
                className="flex h-full w-full items-center justify-center"
                darkText
              />
            </div>

            <FoldedBar side="blue" className="rounded-r-sm pr-1">
              <div className={`${SCORE_CELL_CLASS} w-14 text-[47px]`}>{m.player2Score}</div>
              <button
                type="button"
                onClick={() => canEdit && m.setShowPlayer2Modal(true)}
                className={`${nameClass} justify-end text-right`}
              >
                <div className={`${PLAYER_NAME_CLASS} text-[40px]`}>{m.getPlayer2Name()}</div>
              </button>
              <button
                type="button"
                onClick={() => canEdit && m.setShowPlayer2Modal(true)}
                className={photoClass}
                style={{ width: PHOTO_PX, height: PHOTO_PX, marginRight: 4 }}
                title={canEdit ? "Select Player B" : undefined}
              >
                <Image
                  src={m.getPlayer2Photo() || placeholderFor(m.player2, "player2")}
                  alt={m.getPlayer2Name()}
                  width={PHOTO_PX}
                  height={PHOTO_PX}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              </button>
            </FoldedBar>
          </div>
        </div>

        <div className="mt-4 flex flex-col items-center gap-1">
          <div className="flex max-w-full flex-wrap items-center justify-center gap-1 rounded-full bg-white/95 px-3 py-1.5 shadow-sm">
            {m.rackBalls.map((n) => {
              const pocketed = m.pocketedBalls.has(n);
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => m.handleBallClick(n)}
                  className={`shrink-0 transition-transform ${pocketed ? "" : "hover:scale-110"}`}
                  title={pocketed ? "Ball pocketed" : "Click to pocket/unpocket"}
                >
                  <PoolBall number={n} size={62} pocketed={pocketed} />
                </button>
              );
            })}
          </div>
          <BallResetButton onClick={m.handleResetBalls} />
        </div>
      </div>

      <CreatorOverlayModals m={m} />
    </VerticalStage>
  );
}
