import { useState } from "react";
import { Check } from "lucide-react";
import { BrandMark } from "@/components/landing/shared";
import { cn } from "@/lib/utils";

const HOSTS = ["WordPress", "Shopify", "Webflow", "Wix", "Framer", "Webhooks"];

export function HostingPicker() {
  const [selected, setSelected] = useState("WordPress");
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {HOSTS.map((host) => {
        const active = selected === host;
        return (
          <button
            key={host}
            type="button"
            onClick={() => setSelected(host)}
            className={cn(
              "relative flex items-center gap-2.5 rounded-xl border bg-card px-3.5 py-3 text-left text-sm font-semibold text-ink shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
              active ? "border-ink ring-2 ring-ink/15" : "border-border",
            )}
          >
            <BrandMark name={host} className="h-7 w-7 shrink-0" />
            <span className="truncate">{host}</span>
            {active && (
              <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-ink text-background">
                <Check className="h-3 w-3" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}