/**
 * The generated cover art, styled after Webflow's blog covers: a flat field
 * of two or three brand colours, oversized shapes cropped by the frame,
 * hairline diagrams with node dots, and no headline. Each scene pictures what
 * a post is about in Rankbox's terms; CoverArt picks which.
 */
import type { ComponentType } from "react";
import { BotsScene, CrawlScene, FileScene } from "./crawl-scenes";
import { AnalyticsScene, FeedScene, LeaderboardScene, TrafficScene } from "./data-scenes";
import { AnswerScene, LockupScene } from "./engine-scenes";
import { H, W, type SceneName, type SceneProps } from "./kit";
import { CompareScene, GraphScene, WriteScene } from "./shape-scenes";

const SCENES: Record<SceneName, ComponentType<SceneProps>> = {
  lockup: LockupScene,
  answer: AnswerScene,
  analytics: AnalyticsScene,
  leaderboard: LeaderboardScene,
  traffic: TrafficScene,
  feed: FeedScene,
  crawl: CrawlScene,
  bots: BotsScene,
  file: FileScene,
  compare: CompareScene,
  write: WriteScene,
  graph: GraphScene,
};

/* The canvas, scaled to cover its box like object-fit: cover. */
export function CoverScene({ scene, ...props }: SceneProps & { scene: SceneName }) {
  const Scene = SCENES[scene];
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
    >
      <Scene {...props} />
    </svg>
  );
}
