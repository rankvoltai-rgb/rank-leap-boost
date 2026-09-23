import { cn } from "@/lib/utils";
import type { Connector } from "@/data/connectors";
import { IntegrationLogo } from "@/components/dashboard/integration-logos";
import { SIMPLE_MARKS } from "@/components/dashboard/connector-marks";
import { ChatGPTMark, CopilotMark } from "@/components/landing/ai-logos";
import { VoltMark } from "@/components/dashboard/icons";

/**
 * A connector's app icon, drawn the way IntegrationLogo draws the publishing
 * platforms: the brand's color as the tile, its mark in white. One system for
 * the whole library, so sixty logos read as a set and none shouts louder.
 *
 * Tools with no published mark get their initials on their brand color rather
 * than a guessed-at copy of their logo.
 */
const TILE = "shrink-0 rounded-[25%] ring-1 ring-black/5 dark:ring-white/15";

// Pure black tiles use the page's near-black so they sit with the rest of the UI.
const tileColor = (hex: string) => (hex.toUpperCase() === "#000000" ? "#0A0A0B" : hex);

/** Dark glyph on light brand colors (TRAE's green), white everywhere else. */
function glyphColor(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return 0.299 * r + 0.587 * g + 0.114 * b > 186 ? "#0A0A0B" : "#FFFFFF";
}

export function ConnectorLogo({
  connector,
  className,
}: {
  connector: Connector;
  className?: string;
}) {
  const { mark, name } = connector;
  const size = cn("h-10 w-10", className);

  if ("platform" in mark)
    return <IntegrationLogo id={mark.platform} title={false} className={size} />;

  if ("simple" in mark) {
    const { hex, path } = SIMPLE_MARKS[mark.simple];
    return (
      <svg viewBox="0 0 24 24" role="img" aria-label={name} className={cn(TILE, size)}>
        <rect width="24" height="24" rx="6" fill={tileColor(hex)} />
        <path
          d={path}
          fill={glyphColor(tileColor(hex))}
          transform="translate(12 12) scale(0.56) translate(-12 -12)"
        />
      </svg>
    );
  }

  if ("landing" in mark) {
    // ChatGPT's own app icon is white on black; Copilot's mark is a gradient
    // that only reads on white.
    const chatgpt = mark.landing === "chatgpt";
    return (
      <span
        role="img"
        aria-label={name}
        className={cn(
          TILE,
          "grid place-items-center",
          chatgpt ? "bg-[#0A0A0B] text-white" : "bg-white",
          size,
        )}
      >
        {chatgpt ? (
          <ChatGPTMark className="h-[58%] w-[58%] !text-white" />
        ) : (
          <CopilotMark className="h-[62%] w-[62%]" />
        )}
      </span>
    );
  }

  if ("rankbox" in mark) {
    return (
      <span
        role="img"
        aria-label={name}
        className={cn(TILE, "grid place-items-center bg-brand-blue text-white", size)}
      >
        {mark.rankbox === "api" ? (
          <span className="font-mono text-[0.8em] font-semibold leading-none">{"{ }"}</span>
        ) : (
          <VoltMark className="h-[50%] w-[50%]" />
        )}
      </span>
    );
  }

  return (
    <span
      role="img"
      aria-label={name}
      style={{ backgroundColor: mark.color, color: glyphColor(mark.color) }}
      className={cn(
        TILE,
        "grid place-items-center font-semibold tracking-tight [container-type:inline-size]",
        size,
      )}
    >
      <span className={mark.mono.length > 1 ? "text-[length:38cqw]" : "text-[length:48cqw]"}>
        {mark.mono}
      </span>
    </span>
  );
}
