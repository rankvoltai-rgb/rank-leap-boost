import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { FileText, Hash, Search } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { docsSearchQuery } from "@/lib/docs/queries";
import { cn } from "@/lib/utils";

/**
 * Search across every page title, description and section heading. The index
 * loads the first time search opens, so pages that never search never pay
 * for it. ⌘K / Ctrl+K or "/" opens it from anywhere in the docs.
 */
export function DocsSearch({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const router = useRouter();
  const { data, isLoading, isError } = useQuery({ ...docsSearchQuery, enabled: open });
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // The target is the document itself when nothing has focus.
      const typing =
        e.target instanceof Element &&
        e.target.closest("input, textarea, select, [contenteditable]");
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        onOpenChange(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onOpenChange]);

  const go = (href: string) => {
    onOpenChange(false);
    setQuery("");
    void router.navigate({ href });
  };

  const showHeadings = query.trim().length >= 2;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-[12vh] translate-y-0 gap-0 overflow-hidden rounded-xl p-0 sm:max-w-xl">
        <DialogTitle className="sr-only">Search the docs</DialogTitle>
        <DialogDescription className="sr-only">
          Find a page or a section by its title or description.
        </DialogDescription>
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-2.5 [&_[cmdk-item]_svg]:h-4 [&_[cmdk-item]_svg]:w-4">
          <CommandInput
            value={query}
            onValueChange={setQuery}
            placeholder="Search the docs: API keys, autopilot, 402…"
          />
          <CommandList className="max-h-[min(28rem,60vh)]">
            <CommandEmpty>
              {isLoading
                ? "Loading the index…"
                : isError
                  ? "Search couldn't load. Refresh the page and try again."
                  : "No page matches that. Try a shorter word."}
            </CommandEmpty>
            {data && (
              <CommandGroup heading="Pages">
                {data.map((page) => (
                  <CommandItem
                    key={page.path}
                    value={`${page.title} ${page.section} ${page.path}`}
                    keywords={[page.description]}
                    onSelect={() => go(page.path)}
                    className="items-start gap-3"
                  >
                    <FileText className="mt-0.5 text-muted-foreground" />
                    <span className="min-w-0">
                      <span className="block font-medium text-ink">{page.title}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {page.section}: {page.description}
                      </span>
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {data && showHeadings && (
              <CommandGroup heading="Sections">
                {data.flatMap((page) =>
                  page.headings.map((h) => (
                    <CommandItem
                      key={`${page.path}#${h.id}`}
                      value={`${h.text} ${page.title} ${page.path}#${h.id}`}
                      onSelect={() => go(`${page.path}#${h.id}`)}
                      className="gap-3"
                    >
                      <Hash className="text-muted-foreground" />
                      <span className="min-w-0 truncate">
                        <span className="text-ink">{h.text}</span>
                        <span className="text-muted-foreground"> in {page.title}</span>
                      </span>
                    </CommandItem>
                  )),
                )}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

/** The search field in the header: a button that looks like an input. */
export function SearchTrigger({ onOpen, className }: { onOpen: () => void; className?: string }) {
  const [mac, setMac] = useState(true);
  useEffect(() => setMac(/Mac|iPhone|iPad/.test(navigator.platform)), []);
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Search the docs"
      className={cn(
        "flex h-9 items-center gap-2.5 rounded-lg border border-border bg-card px-3 text-sm text-muted-foreground shadow-1 transition-colors hover:border-ink/20 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta",
        className,
      )}
    >
      <Search className="h-4 w-4 shrink-0" />
      <span className="flex-1 text-left">Search docs</span>
      <kbd className="hidden rounded border border-border bg-secondary px-1.5 py-0.5 font-sans text-[0.7rem] font-medium text-muted-foreground sm:inline">
        {mac ? "⌘K" : "Ctrl K"}
      </kbd>
    </button>
  );
}
