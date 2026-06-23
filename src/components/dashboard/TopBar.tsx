import { useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getCredits, getProfile, creditsRemaining } from "@/lib/api";
import { Avatar } from "@/components/landing/shared";
import { CardIcon, SignOutIcon } from "@/components/dashboard/icons";
import { cn } from "@/lib/utils";

export function TopBar() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: credits } = useQuery({ queryKey: ["credits"], queryFn: getCredits });
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: getProfile });

  const remaining = credits ? creditsRemaining(credits) : null;
  const tone =
    remaining === null
      ? "neutral"
      : remaining <= 0
        ? "danger"
        : remaining <= 3
          ? "warning"
          : "neutral";

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-end gap-3 border-b border-border bg-card/70 px-5 backdrop-blur-xl">
      <button
        type="button"
        onClick={() => navigate({ to: "/dashboard/billing" })}
        title="Articles remaining this month"
        className={cn(
          "group inline-flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors",
          tone === "danger" &&
            "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/15",
          tone === "warning" &&
            "border-warning/30 bg-warning/10 text-warning hover:bg-warning/15",
          tone === "neutral" &&
            "border-border bg-secondary/60 text-ink hover:border-ink/15 hover:bg-secondary",
        )}
      >
        <CardIcon
          className={cn(
            "h-3.5 w-3.5",
            tone === "danger" && "text-destructive",
            tone === "warning" && "text-warning",
            tone === "neutral" && "text-muted-foreground",
          )}
        />
        <span className="tabular-nums">{remaining === null ? "—" : remaining.toLocaleString()}</span>
        <span className={cn("font-normal", tone === "neutral" ? "text-muted-foreground" : "opacity-80")}>
          {remaining === 0 ? "credits — upgrade" : "credits left"}
        </span>
      </button>

      <span className="h-5 w-px bg-border" />

      <div className="flex items-center gap-2.5">
        <Avatar name={profile?.brand_name ?? "Rankvolt"} className="h-8 w-8 ring-1 ring-border" />
        <span className="hidden max-w-[140px] truncate text-sm font-medium text-ink sm:block">
          {profile?.brand_name ?? "Rankvolt"}
        </span>
        <button
          type="button"
          onClick={signOut}
          aria-label="Sign out"
          className="ml-0.5 grid h-8 w-8 place-items-center rounded-lg border border-transparent text-muted-foreground transition-colors hover:border-border hover:bg-secondary hover:text-ink"
        >
          <SignOutIcon className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}