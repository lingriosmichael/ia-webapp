import { cn } from "@/lib/utils";

// Shared decorative language for the landing page: the organic blobs, the
// dot-grid, and the connector line give every section the same visual
// system instead of each one inventing its own decorative style.

type BlobTone = "signal" | "apricot" | "pistachio" | "skyMist";

const BLOB_FILL: Record<BlobTone, string> = {
  signal: "fill-signal/18",
  apricot: "fill-apricot/22",
  pistachio: "fill-pistachio",
  skyMist: "fill-sky-mist/35",
};

// One hand-drawn organic silhouette (not a circle, not a rounded-rect) reused
// at different scales and rotations so it never repeats identically.
export function OrganicBlob({
  tone,
  className,
}: {
  tone: BlobTone;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden="true"
      className={cn("pointer-events-none", className)}
    >
      <path
        d="M129.4 18.6c26.8 9.7 47.4 34.4 51.9 62.6 4.5 28.2-7.1 60-29.6 77.9-22.5 17.9-55.9 21.9-83.1 9.6-27.2-12.3-48.2-40.7-49.6-70.3C17.6 68.8 35.8 38 62.6 22.9c26.8-15.1 39.9-13.9 66.8-4.3Z"
        className={BLOB_FILL[tone]}
      />
    </svg>
  );
}

// Shared "fade the section floor" scrim: wherever a full-bleed photo/video
// plane meets flat page ground, this hides the clip line at any scroll
// position instead of ending in a hard horizontal seam. One height scale,
// one tone, reused everywhere a plane needs to dissolve rather than cut —
// see references/devices.md's parallax section in the scroll-craft skill.
export function SectionFloorFade({ edge }: { edge: "top" | "bottom" }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute inset-x-0 h-28 sm:h-40",
        edge === "top"
          ? "top-0 bg-gradient-to-b from-[#e7ebe1] to-transparent"
          : "bottom-0 bg-gradient-to-t from-[#e7ebe1] to-transparent",
      )}
    />
  );
}

export function DotGridPattern({ className }: { className?: string }) {
  const patternId = "landing-dot-grid";
  return (
    <svg
      aria-hidden="true"
      className={cn("pointer-events-none", className)}
      width="100%"
      height="100%"
    >
      <defs>
        <pattern
          id={patternId}
          x="0"
          y="0"
          width="16"
          height="16"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1.5" cy="1.5" r="1.5" className="fill-apricot/35" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}

// The line-with-nodes motif from the hero mockup, redrawn as a real SVG so it
// can connect the "How brindl helps" steps. `drawn` gates the stroke-reveal
// animation off useScrollReveal rather than firing on mount.
export function ConnectorLine({
  drawn,
  className,
}: {
  drawn: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 4"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn("pointer-events-none", className)}
    >
      <path
        d="M0 2 C 25 2, 25 2, 50 2 S 75 2, 100 2"
        pathLength={100}
        fill="none"
        stroke="var(--signal)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="100"
        strokeDashoffset={drawn ? 0 : 100}
        style={{
          transition: "stroke-dashoffset 900ms cubic-bezier(0, 0, 0.2, 1)",
        }}
      />
    </svg>
  );
}
