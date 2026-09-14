"use client";

import { type ReactNode } from "react";
import Image from "next/image";
import PoolBall from "@/components/PoolBall";
import { BallResetButton, CreatorOverlayModals } from "@/components/creator-vertical/CreatorOverlayModals";
import { VerticalRaceCell } from "@/components/creator-vertical/VerticalRaceCell";
import { VerticalStage } from "@/components/creator-vertical/VerticalStage";
import { useOverlayMatch, placeholderFor } from "@/hooks/useOverlayMatch";
import {
  PHOTO_BUTTON_BASE,
  PHOTO_PX,
  PLAYER_NAME_CLASS,
  SCORE_CELL_CLASS,
  VERTICAL_BOTTOM_BAR_CLASS,
} from "@/lib/creatorVerticalSpacing";
import { VERTICAL_BALL_SIZE } from "@/lib/creatorBallSizes";

const BAR_H = 92;

const FOLD_NAVY =
  "linear-gradient(to bottom, #3A4A7A 0%, #3A4A7A 48%, #1A2748 52%, #1A2748 100%)";

const FoldedNavyBar = ({ children }: { children: ReactNode }) => (
  <div
    className="relative flex w-full items-center overflow-visible rounded-sm"
    style={{ height: BAR_H, background: FOLD_NAVY }}
  >
    <div
      className="pointer-events-none absolute inset-x-0 top-1/2 z-[1] h-px -translate-y-1/2"
      style={{
        background:
          "linear-gradient(to right, transparent, rgba(255,255,255,0.3), rgba(0,0,0,0.35), transparent)",
      }}
    />
    <div className="relative z-[2] flex h-full w-full items-center">{children}</div>
  </div>
);

/** Overlay4S3 vertical (navy Creator Overlay 5). */
export default function Overlay4S3Vertical({ matchId }: { matchId: string }) {
  const m = useOverlayMatch({
    matchId,
    enableBalls: true,
    rackStyle: "icons",
    defaultRaceTo: 9,
  });
  const { canEdit } = m;

  const photoClass = `${PHOTO_BUTTON_BASE} rounded-[10%] border border-white/30 shadow-md ${
    canEdit ? "cursor-pointer hover:opacity-90" : "cursor-default"
  }`;

  const nameClass = `flex h-full min-w-0 flex-1 items-center justify-center px-1 uppercase tracking-wide ${
    canEdit ? "cursor-pointer hover:opacity-90" : "cursor-default"
  }`;

  return (
    <VerticalStage>
      <div className={VERTICAL_BOTTOM_BAR_CLASS}>
        <div className="mb-4 flex flex-col items-center gap-1">
          <div className="flex max-w-full flex-wrap items-center justify-center gap-1.5">
            {m.rackBalls.map((n) => {
              const pocketed = m.pocketedBalls.has(n);
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => m.handleBallClick(n)}
                  className={`shrink-0 transition-opacity ${
                    pocketed ? "opacity-25" : "opacity-100 hover:scale-110"
                  }`}
                  title={pocketed ? "Ball pocketed" : "Click to pocket/unpocket"}
                >
                  <PoolBall number={n} size={VERTICAL_BALL_SIZE} pocketed={pocketed} />
                </button>
              );
            })}
          </div>
          <BallResetButton onClick={m.handleResetBalls} />
        </div>

        <div
          className="relative flex w-full items-end overflow-visible"
          style={{ minHeight: PHOTO_PX }}
        >
          <FoldedNavyBar>
            <button
              type="button"
              onClick={() => canEdit && m.setShowPlayer1Modal(true)}
              className={photoClass}
              style={{ width: PHOTO_PX, height: PHOTO_PX, marginLeft: 6 }}
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
              className={nameClass}
            >
              <div className={PLAYER_NAME_CLASS}>{m.getPlayer1Name()}</div>
            </button>
            <div className={SCORE_CELL_CLASS}>{m.player1Score}</div>
            <VerticalRaceCell
              m={m}
              className="flex h-full w-14 shrink-0 items-center justify-center border-x border-white/20 px-1"
            />
            <div className={SCORE_CELL_CLASS}>{m.player2Score}</div>
            <button
              type="button"
              onClick={() => canEdit && m.setShowPlayer2Modal(true)}
              className={nameClass}
            >
              <div className={PLAYER_NAME_CLASS}>{m.getPlayer2Name()}</div>
            </button>
            <button
              type="button"
              onClick={() => canEdit && m.setShowPlayer2Modal(true)}
              className={photoClass}
              style={{ width: PHOTO_PX, height: PHOTO_PX, marginRight: 6 }}
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
          </FoldedNavyBar>
        </div>
      </div>

      <CreatorOverlayModals m={m} />
    </VerticalStage>
  );
}
