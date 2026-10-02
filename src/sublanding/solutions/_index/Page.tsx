import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "./Hero";
import { Switchboard } from "./Switchboard";
import { OtherWays } from "./OtherWays";
import { OnePlan } from "./OnePlan";
import { Questions } from "./Questions";

/**
 * /solutions: route first, sell second. The hero and the switchboard share
 * the first screen; everything below is for the visitor whose problem isn't
 * on the board yet, or who wants to know what any of these pages costs.
 */
export function SolutionsHubPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Switchboard />
        <OtherWays />
        <OnePlan />
        <Questions />
      </main>
      <Footer />
    </div>
  );
}
