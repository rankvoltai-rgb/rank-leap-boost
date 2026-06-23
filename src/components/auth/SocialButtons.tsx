import type { ReactNode } from "react";
import { toast } from "sonner";
import { lovable } from "@/integrations/lovable";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden fill="currentColor">
      <path d="M16.36 12.78c.02 2.5 2.18 3.33 2.2 3.34-.02.06-.34 1.18-1.13 2.34-.68 1-1.39 2-2.51 2.02-1.1.02-1.45-.65-2.7-.65-1.26 0-1.65.63-2.69.67-1.08.04-1.9-1.08-2.59-2.08-1.4-2.04-2.48-5.76-1.04-8.27.72-1.25 2-2.04 3.39-2.06 1.06-.02 2.06.71 2.71.71.65 0 1.87-.88 3.15-.75.54.02 2.05.22 3.02 1.64-.08.05-1.8 1.05-1.78 3.13M14.3 4.93c.57-.69.96-1.65.85-2.61-.83.03-1.83.55-2.42 1.24-.53.61-.99 1.59-.87 2.53.92.07 1.87-.47 2.44-1.16" />
    </svg>
  );
}


function SocialButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-ink shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      {children}
    </button>
  );
}

export function SocialButtons() {
  async function google() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/onboarding",
    });
    if (result?.error) {
      toast.error("Could not sign in with Google. Please try again.");
    }
  }

  async function apple() {
    const result = await lovable.auth.signInWithOAuth("apple", {
      redirect_uri: window.location.origin + "/onboarding",
    });
    if (result?.error) {
      toast.error("Could not sign in with Apple. Please try again.");
    }
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <SocialButton onClick={google}>
        <GoogleIcon /> Google
      </SocialButton>
      <SocialButton onClick={apple}>
        <AppleIcon /> Apple
      </SocialButton>
    </div>
  );
}