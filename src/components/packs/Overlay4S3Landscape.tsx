"use client";

import { type ReactNode } from "react";
import Image from "next/image";
import OverlayLogoColumn from "@/components/OverlayLogoColumn";
import PlayerSelectionModal from "@/components/PlayerSelectionModal";
import WinnerModal from "@/components/WinnerModal";
import PoolBall from "@/components/PoolBall";
import { useHorizontalBallSize } from "@/hooks/useHorizontalBallSize";
import { useOverlayLogos } from "@/hooks/useOverlayLogos";
import { useOverlayMatch, placeholderFor } from "@/hooks/useOverlayMatch";

const BAR_H = 72;
const PHOTO_SIZE = 98;

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

/** Overlay4S3 landscape (navy Creator Overlay 5). */
export default function Overlay4S3Landscape({ matchId }: { matchId: string }) {
  const ballSize = useHorizontalBallSize();
  const m = useOverlayMatch({
    matchId,
    enableBalls: true,
    rackStyle: "icons",
    defaultRaceTo: 9,
  });
  const { canEdit } = m;
  const overlayLogos = useOverlayLogos(matchId);

  const photoClass = `relative z-10 shrink-0 overflow-hidden rounded-[10%] border border-white/30 shadow-md ${
    canEdit ? "cursor-pointer hover:opacity-90" : "cursor-default"
  }`;

  const nameClass = `min-w-0 flex-1 truncate text-[32px] font-bold uppercase tracking-wide text-white ${
    canEdit ? "cursor-pointer hover:opacity-90" : "cursor-default"
  }`;

  const scoreBoxClass =
    "flex shrink-0 items-center justify-center rounded-md bg-black/35 px-1 min-w-12 text-[32px] font-bold tabular-nums text-white sm:min-w-14";

  return (
    <div className="relative flex h-[100dvh] w-full flex-col items-center justify-end overflow-hidden bg-transparent pb-8 sm:pb-12 md:pb-16">
      <OverlayLogoColumn canEdit={canEdit} {...overlayLogos} />
      <div className="flex w-full max-w-[1100px] flex-col items-center gap-2 px-3 sm:px-4">
        <div
          className="relative flex w-full items-center overflow-visible"
          style={{ minHeight: PHOTO_SIZE }}
        >
          <FoldedNavyBar>
            <button
              type="button"
              onClick={() => canEdit && m.setShowPlayer1Modal(true)}
              className={photoClass}
              style={{ width: PHOTO_SIZE, height: PHOTO_SIZE, marginLeft: 6 }}
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
              className={`ml-2 mr-2 text-left ${nameClass}`}
            >
              {m.getPlayer1Name()}
            </button>
            <span className={`${scoreBoxClass} mr-2`}>{m.player1Score}</span>

            <div className="mx-1 flex shrink-0 flex-col items-center justify-center border-x border-white/20 px-3 sm:px-4">
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
                  className="w-14 bg-transparent text-center text-[25.6px] font-bold text-white outline-none"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (!canEdit) return;
                    m.setTempRaceTo(String(m.raceTo));
                    m.setShowRaceToInput(true);
                  }}
                  className={`whitespace-nowrap text-[25.6px] font-semibold text-white ${
                    canEdit ? "cursor-pointer hover:opacity-80" : "cursor-default"
                  }`}
                  title={canEdit ? "Click to edit race to" : undefined}
                >
                  Race to {m.raceTo}
                </button>
              )}
            </div>

            <span className={`${scoreBoxClass} ml-2`}>{m.player2Score}</span>
            <button
              type="button"
              onClick={() => canEdit && m.setShowPlayer2Modal(true)}
              className={`ml-2 mr-2 text-right ${nameClass}`}
            >
              {m.getPlayer2Name()}
            </button>
            <button
              type="button"
              onClick={() => canEdit && m.setShowPlayer2Modal(true)}
              className={photoClass}
              style={{ width: PHOTO_SIZE, height: PHOTO_SIZE, marginRight: 6 }}
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
          </FoldedNavyBar>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5">
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
                <PoolBall number={n} size={ballSize} pocketed={pocketed} />
              </button>
            );
          })}
          <button
            type="button"
            onClick={m.handleResetBalls}
            className="shrink-0 text-gray-400 opacity-50 transition-opacity hover:opacity-100"
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
}
