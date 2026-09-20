import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
// The one font file almost every page needs; preloaded so text paints in it.
import jakartaLatin from "@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-semibold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

const SITE_URL = "https://rankbox.xyz";

const OG_IMAGE_ALT =
  "Rankbox: get AI traffic on autopilot — a ChatGPT answer citing a brand as its source.";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Rankbox — Get AI Traffic on Autopilot" },
      { name: "google-site-verification", content: "fG4neVF-dPj7kLMIjpCUpXjX2XhTPhoZvyyiGL-xs40" },
      { name: "trustpilot-one-time-domain-verification-id", content: "de145b7d-659e-4783-a55a-4dac354411ea" },
      { name: "description", content: "Rankbox is the AI growth engine that researches, writes, and publishes daily articles engineered to get your brand cited by ChatGPT, Perplexity, and Google AI Overviews — and ranked on classic search." },
      { name: "author", content: "Rankbox" },
      { property: "og:title", content: "Rankbox — Get AI Traffic on Autopilot" },
      { property: "og:description", content: "Rankbox is the AI growth engine that researches, writes, and publishes daily articles engineered to get your brand cited by ChatGPT, Perplexity, and Google AI Overviews — and ranked on classic search." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:site_name", content: "Rankbox" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Rankbox — Get AI Traffic on Autopilot" },
      { name: "twitter:description", content: "Rankbox is the AI growth engine that researches, writes, and publishes daily articles engineered to get your brand cited by ChatGPT, Perplexity, and Google AI Overviews — and ranked on classic search." },
      // Built from scripts/og/card.html — re-render with scripts/og/render.sh.
      // Absolute, because crawlers resolve og:image against nothing.
      { property: "og:image", content: `${SITE_URL}/assets/og-rankbox.png` },
      { property: "og:image:secure_url", content: `${SITE_URL}/assets/og-rankbox.png` },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: OG_IMAGE_ALT },
      { name: "twitter:image", content: `${SITE_URL}/assets/og-rankbox.png` },
      { name: "twitter:image:alt", content: OG_IMAGE_ALT },
    ],
    links: [
      {
        rel: "preload",
        href: jakartaLatin,
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", type: "image/svg+xml", href: "/mark.svg" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    ],
    scripts: [
      {
        type: "text/javascript",
        src: "//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js",
        async: true,
      },
      {
        type: "text/javascript",
        children: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "yla8sheb6t");`,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <Toaster />
    </QueryClientProvider>
  );
}
