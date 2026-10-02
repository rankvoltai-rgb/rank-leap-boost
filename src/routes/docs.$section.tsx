import { Outlet, createFileRoute, notFound, useRouterState } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { DocsNotFound } from "@/components/docs/DocsNotFound";
import { getDocsSection } from "@/data/docs";
import { docsNavQuery } from "@/lib/docs/queries";

/** A section and its pages: the sidebar on the left, the page beside it. */
export const Route = createFileRoute("/docs/$section")({
  loader: ({ params }) => {
    if (!getDocsSection(params.section)) throw notFound();
  },
  component: SectionLayout,
  notFoundComponent: DocsNotFound,
});

function SectionLayout() {
  const { data } = useSuspenseQuery(docsNavQuery);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:grid lg:grid-cols-[15.5rem_minmax(0,1fr)] lg:gap-10 xl:gap-14">
      <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] overflow-y-auto overscroll-contain py-8 pr-1 lg:block">
        <DocsSidebar sections={data.sections} pathname={pathname} />
      </aside>
      <div className="min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
