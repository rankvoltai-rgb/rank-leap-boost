import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { signOut as endSession } from "@/lib/auth";

/**
 * Ends the session and returns to sign-in.
 *
 * Cached queries are cancelled and cleared first so the next account to sign
 * in on this browser never sees the previous one's data flash on screen.
 */
export function useSignOut() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await endSession();
    navigate({ to: "/auth", replace: true });
  };
}
