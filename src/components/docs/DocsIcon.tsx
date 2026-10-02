import {
  Bot,
  Code2,
  CreditCard,
  LifeBuoy,
  PenLine,
  Plug,
  Rocket,
  Send,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import type { DocsIcon as DocsIconName } from "@/data/docs";

const ICONS: Record<DocsIconName, LucideIcon> = {
  rocket: Rocket,
  pen: PenLine,
  send: Send,
  trending: TrendingUp,
  plug: Plug,
  code: Code2,
  bot: Bot,
  card: CreditCard,
  lifebuoy: LifeBuoy,
};

export function DocsIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name as DocsIconName] ?? Rocket;
  return <Icon className={className} aria-hidden />;
}
