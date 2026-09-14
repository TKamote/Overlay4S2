"use client";

import Overlay4S2Landscape from "@/components/packs/Overlay4S2Landscape";
import Overlay4S3Landscape from "@/components/packs/Overlay4S3Landscape";
import { isPackId } from "@/lib/packs";

export default function PackLandscapeOverlayPage({
  params,
}: {
  params: { pack: string; matchId: string };
}) {
  const { pack, matchId } = params;
  if (!isPackId(pack)) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center p-8 text-neutral-600">
        Unknown overlay pack.
      </main>
    );
  }
  if (pack === "jhayr") return <Overlay4S2Landscape matchId={matchId} />;
  return <Overlay4S3Landscape matchId={matchId} />;
}
