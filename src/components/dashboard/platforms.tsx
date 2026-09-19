/** The publishing platforms as a row of logos. List lives in src/data/platforms.ts. */
import { cn } from "@/lib/utils";
import { PUBLISH_PLATFORMS } from "@/data/platforms";
import { IntegrationLogo } from "@/components/dashboard/integration-logos";

/** A compact row of the publishing platforms. */
export function PlatformLogos({
  className,
  size = "h-5 w-5",
}: {
  className?: string;
  size?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      {PUBLISH_PLATFORMS.map((platform) => (
        <IntegrationLogo key={platform.id} id={platform.id} className={size} />
      ))}
    </span>
  );
}
