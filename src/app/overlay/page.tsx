"use client";

import { type ReactNode } from "react";
import Image from "next/image";
import PlayerSelectionModal from "@/components/PlayerSelectionModal";
import WinnerModal from "@/components/WinnerModal";
import PoolBall from "@/components/PoolBall";
import { useOverlayMatch, placeholderFor } from "@/hooks/useOverlayMatch";

const MATCH_ID = "overlay4s1";
const BAR_H = 72;
const PHOTO_SIZE = 98;

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

const CreatorOverlay4Page = () => {
  const m = useOverlayMatch({
    matchId: MATCH_ID,
    enableBalls: true,
    rackStyle: "full",
    defaultRaceTo: 10,
  });
  const { canEdit } = m;

  const photoClass = `relative z-10 shrink-0 overflow-hidden rounded-[20%] border border-white/40 shadow-md ${
    canEdit ? "cursor-pointer hover:opacity-90" : "cursor-default"
  }`;

  return (
    <div className="flex h-[100dvh] w-full flex-col items-center justify-end overflow-hidden bg-transparent pb-3 sm:pb-4 md:pb-5">
      <div className="flex w-full max-w-[1100px] flex-col items-center gap-3 px-3 sm:px-4">
        <div
          className="relative flex w-full items-center overflow-visible"
          style={{ minHeight: PHOTO_SIZE }}
        >
          <div className="flex w-full items-stretch overflow-visible">
            <FoldedBar side="red" className="rounded-l-sm pl-1">
              <button
                type="button"
                onClick={() => canEdit && m.setShowPlayer1Modal(true)}
                className={photoClass}
                style={{ width: PHOTO_SIZE, height: PHOTO_SIZE, marginLeft: 4 }}
                title={canEdit ? "Select Player A" : undefined}
              >
                <Image
                  src={m.getPlayer1Photo() || placeholderFor(m.player1, "player1")}
                  alt={m.getPlayer1Name()}
                  width={PHOTO_SIZE}
                  height={PHOTO_SIZE}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              </button>
              <button
                type="button"
                onClick={() => canEdit && m.setShowPlayer1Modal(true)}
                className={`mx-2 min-w-0 flex-1 truncate text-left text-[32px] font-bold uppercase tracking-wide text-white ${
                  canEdit ? "cursor-pointer hover:opacity-90" : "cursor-default"
                }`}
              >
                {m.getPlayer1Name()}
              </button>
              <span className="mr-2 shrink-0 text-[32px] font-bold tabular-nums text-white">
                {m.player1Score}
              </span>
            </FoldedBar>

            <div
              className="relative z-[3] flex shrink-0 flex-col items-center justify-center bg-white px-3 shadow-sm sm:px-4"
              style={{ height: BAR_H + 8, minWidth: 110 }}
            >
              {m.showRaceToInput && canEdit ? (
                <input
                  autoFocus
                  type="number"
                  min={1}
                  max={50}
                  value={m.tempRaceTo}
                  onChange={(e) => m.setTempRaceTo(e.target.value)}
                  onBlur={m.handleRaceToChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") m.handleRaceToChange();
                    if (e.key === "Escape") {
                      m.setTempRaceTo(String(m.raceTo));
                      m.setShowRaceToInput(false);
                    }
                  }}
                  className="w-16 bg-transparent text-center text-[25.6px] font-bold text-neutral-900 outline-none"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (!canEdit) return;
                    m.setTempRaceTo(String(m.raceTo));
                    m.setShowRaceToInput(true);
                  }}
                  className={`text-[25.6px] font-bold text-neutral-900 ${
                    canEdit ? "cursor-pointer hover:opacity-80" : "cursor-default"
                  }`}
                  title={canEdit ? "Click to edit race to" : undefined}
                >
                  Race to {m.raceTo}
                </button>
              )}
            </div>

            <FoldedBar side="blue" className="rounded-r-sm pr-1">
              <span className="ml-2 shrink-0 text-[32px] font-bold tabular-nums text-white">
                {m.player2Score}
              </span>
              <button
                type="button"
                onClick={() => canEdit && m.setShowPlayer2Modal(true)}
                className={`mx-2 min-w-0 flex-1 truncate text-right text-[32px] font-bold uppercase tracking-wide text-white ${
                  canEdit ? "cursor-pointer hover:opacity-90" : "cursor-default"
                }`}
              >
                {m.getPlayer2Name()}
              </button>
              <button
                type="button"
                onClick={() => canEdit && m.setShowPlayer2Modal(true)}
                className={photoClass}
                style={{ width: PHOTO_SIZE, height: PHOTO_SIZE, marginRight: 4 }}
                title={canEdit ? "Select Player B" : undefined}
              >
                <Image
                  src={m.getPlayer2Photo() || placeholderFor(m.player2, "player2")}
                  alt={m.getPlayer2Name()}
                  width={PHOTO_SIZE}
                  height={PHOTO_SIZE}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              </button>
            </FoldedBar>
          </div>
        </div>

        <div className="flex max-w-full flex-wrap items-center justify-center gap-1 rounded-full bg-white/95 px-3 py-1.5 shadow-sm sm:gap-1.5 sm:px-4">
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
                  <PoolBall number={n} size={42} pocketed={pocketed} />
                </button>
              );
            })}
            <button
              type="button"
              onClick={m.handleResetBalls}
              className="ml-0.5 shrink-0 text-gray-400 opacity-50 transition-opacity hover:opacity-100"
              title="Reset all balls"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
      </div>

      <PlayerSelectionModal
        isOpen={m.showPlayer1Modal}
        onClose={() => m.setShowPlayer1Modal(false)}
        players={m.players}
        selectedPlayerId={m.player1?.id || null}
        onSelect={m.handlePlayer1Select}
        title="Select Player A"
      />
      <PlayerSelectionModal
        isOpen={m.showPlayer2Modal}
        onClose={() => m.setShowPlayer2Modal(false)}
        players={m.players}
        selectedPlayerId={m.player2?.id || null}
        onSelect={m.handlePlayer2Select}
        title="Select Player B"
      />
      <WinnerModal
        isOpen={m.showWinnerModal}
        onClose={m.handleWinnerModalClose}
        winner={
          m.winner
            ? {
                id: m.winner.id,
                name: m.winner.name,
                photoURL: m.winner.photoURL,
                points: m.winner.points || 0,
              }
            : null
        }
        getPlayerPlaceholder={(playerId) => {
          const hash = playerId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
          return `/avatar-placeholder-${(hash % 6) + 1}.svg`;
        }}
        player1Score={m.player1Score}
        player2Score={m.player2Score}
        player1Name={m.getPlayer1Name()}
        player2Name={m.getPlayer2Name()}
      />
    </div>
  );
};

export default CreatorOverlay4Page;
