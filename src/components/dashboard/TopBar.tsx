import { useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Coins, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getCredits, getProfile } from "@/lib/api";
import { Avatar } from "@/components/landing/shared";

export function TopBar() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: credits } = useQuery({ queryKey: ["credits"], queryFn: getCredits });
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: getProfile });

  const remaining = credits
    ? credits.credits_total - credits.credits_used
    : null;

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-end gap-2.5 border-b border-border bg-card/70 px-5 backdrop-blur-xl">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/70 px-3 py-1 text-xs font-medium text-ink tabular-nums">
        <Coins className="h-3.5 w-3.5 text-warning" />
        {remaining === null ? "—" : remaining.toLocaleString()}
        <span className="text-muted-foreground">credits</span>
      </span>
      <span className="mx-1 h-6 w-px bg-border" />
      <Avatar name={profile?.brand_name ?? "Rankvolt"} className="h-8 w-8 ring-2 ring-border" />
      <button
        type="button"
        onClick={signOut}
        aria-label="Sign out"
        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-ink"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </header>
  );
}