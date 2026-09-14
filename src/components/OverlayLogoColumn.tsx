"use client";

import LogoSelectionModal, { type Logo } from "@/components/LogoSelectionModal";

type OverlayLogoColumnProps = {
  canEdit: boolean;
  logo1URL: string;
  logo2URL: string;
  logos: Logo[];
  showLogo1Modal: boolean;
  showLogo2Modal: boolean;
  setShowLogo1Modal: (open: boolean) => void;
  setShowLogo2Modal: (open: boolean) => void;
  handleSelectLogo: (slot: 1 | 2, logo: Logo) => void;
  handleClearLogo: (slot: 1 | 2) => void;
};

function LogoSlot({
  label,
  logoURL,
  canEdit,
  onPick,
  onClear,
}: {
  label: string;
  logoURL: string;
  canEdit: boolean;
  onPick: () => void;
  onClear: () => void;
}) {
  const hasLogo = Boolean(logoURL);

  if (!canEdit && !hasLogo) return null;

  return (
    <div className="group relative h-[110px] w-[110px]">
      <button
        type="button"
        onClick={() => canEdit && onPick()}
        className={`h-full w-full text-left ${canEdit ? "cursor-pointer hover:opacity-90" : "cursor-default"}`}
        title={canEdit ? "Click to pick logo from Manage players" : undefined}
      >
        {hasLogo ? (
          <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[50%] border-2 border-white bg-white shadow">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoURL} alt={label} className="h-full w-full object-contain" />
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-[50%] border-2 border-dashed border-white/25 bg-white/5" />
        )}
      </button>
      {canEdit && hasLogo && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
          className="absolute right-0.5 top-0.5 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-black/35 text-xs leading-none text-white opacity-0 transition-opacity hover:bg-black/55 hover:opacity-100 group-hover:opacity-40"
          title="Remove logo"
        >
          ×
        </button>
      )}
    </div>
  );
}

/** Two stacked logos top-left; empty slots hidden on OBS, dashed pick target when editing. */
export default function OverlayLogoColumn({
  canEdit,
  logo1URL,
  logo2URL,
  logos,
  showLogo1Modal,
  showLogo2Modal,
  setShowLogo1Modal,
  setShowLogo2Modal,
  handleSelectLogo,
  handleClearLogo,
}: OverlayLogoColumnProps) {
  const showColumn = canEdit || Boolean(logo1URL) || Boolean(logo2URL);

  if (!showColumn) return null;

  return (
    <>
      <div
        className="absolute z-10 flex flex-col items-start gap-2"
        style={{ top: "80px", left: "70px" }}
      >
        <LogoSlot
          label="Logo 1"
          logoURL={logo1URL}
          canEdit={canEdit}
          onPick={() => setShowLogo1Modal(true)}
          onClear={() => handleClearLogo(1)}
        />
        <LogoSlot
          label="Logo 2"
          logoURL={logo2URL}
          canEdit={canEdit}
          onPick={() => setShowLogo2Modal(true)}
          onClear={() => handleClearLogo(2)}
        />
      </div>
      <LogoSelectionModal
        isOpen={showLogo1Modal}
        onClose={() => setShowLogo1Modal(false)}
        logos={logos}
        selectedLogoURL={logo1URL || null}
        onSelect={(logo) => {
          handleSelectLogo(1, logo);
          setShowLogo1Modal(false);
        }}
        title="Select Logo 1"
      />
      <LogoSelectionModal
        isOpen={showLogo2Modal}
        onClose={() => setShowLogo2Modal(false)}
        logos={logos}
        selectedLogoURL={logo2URL || null}
        onSelect={(logo) => {
          handleSelectLogo(2, logo);
          setShowLogo2Modal(false);
        }}
        title="Select Logo 2"
      />
    </>
  );
}
