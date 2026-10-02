import { useEffect, useRef } from "react";
import { useRouter } from "@tanstack/react-router";

/* The language tab a reader last picked ("cURL", "Python"…), applied to every
   tabbed code group on every page. A convenience: it may not persist. */
const TAB_KEY = "docs:code-tab";

function readTab(): string | null {
  try {
    return window.localStorage.getItem(TAB_KEY);
  } catch {
    return null;
  }
}

function saveTab(label: string) {
  try {
    window.localStorage.setItem(TAB_KEY, label);
  } catch {
    // Storage blocked: the choice just won't carry over.
  }
}

/** Selects the tab labelled `label` in every group that has one. */
function selectTab(root: HTMLElement, label: string) {
  root.querySelectorAll<HTMLElement>("[data-tabs]").forEach((group) => {
    const tabs = [...group.querySelectorAll<HTMLButtonElement>("[role=tab]")];
    const match = tabs.find((t) => t.textContent === label);
    if (!match) return;
    for (const tab of tabs) {
      const on = tab === match;
      tab.setAttribute("aria-selected", String(on));
      tab.tabIndex = on ? 0 : -1;
      const panel = group.querySelector<HTMLElement>(`[data-panel="${tab.dataset.tab}"]`);
      if (panel) panel.hidden = !on;
    }
  });
}

/**
 * A docs page body: server-rendered HTML, with its interactive parts (copy
 * buttons, code tabs, in-app links) wired up by delegation so the markup
 * stays plain HTML that agents and crawlers read as-is.
 */
export function DocArticle({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const saved = readTab();
    if (saved) selectTab(root, saved);

    const onClick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      const copy = target.closest<HTMLButtonElement>("[data-copy]");
      if (copy) {
        const block = copy.closest(".docs-code");
        const pre = [...(block?.querySelectorAll("pre") ?? [])].find((p) => !p.closest("[hidden]"));
        if (!pre) return;
        try {
          await navigator.clipboard.writeText(pre.textContent ?? "");
          copy.textContent = "Copied";
        } catch {
          copy.textContent = "Press Ctrl+C";
        }
        window.setTimeout(() => (copy.textContent = "Copy"), 1600);
        return;
      }

      const tab = target.closest<HTMLButtonElement>("[role=tab][data-tab]");
      if (tab) {
        const label = tab.textContent ?? "";
        selectTab(root, label);
        saveTab(label);
        return;
      }

      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (!link || link.target || e.defaultPrevented) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const href = link.getAttribute("href") ?? "";
      // Same-site pages navigate in the app; raw files (.md, .txt, .xml) load as files.
      if (!href.startsWith("/") || href.startsWith("//")) return;
      if (/\.[a-z]+$/i.test(href.split("#")[0])) return;
      e.preventDefault();
      void router.navigate({ href });
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const tab = (e.target as HTMLElement).closest<HTMLButtonElement>("[role=tab]");
      if (!tab || (e.key !== "ArrowRight" && e.key !== "ArrowLeft")) return;
      const tabs = [
        ...(tab.parentElement?.querySelectorAll<HTMLButtonElement>("[role=tab]") ?? []),
      ];
      const i = tabs.indexOf(tab);
      const next = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
      e.preventDefault();
      next.focus();
      next.click();
    };

    root.addEventListener("click", onClick);
    root.addEventListener("keydown", onKeyDown);
    return () => {
      root.removeEventListener("click", onClick);
      root.removeEventListener("keydown", onKeyDown);
    };
  }, [html, router]);

  return <div ref={ref} className="docs-prose" dangerouslySetInnerHTML={{ __html: html }} />;
}
