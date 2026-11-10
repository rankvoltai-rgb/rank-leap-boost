import { describe, expect, it } from "vitest";
import { PERSONA_SLUGS } from "@/data/personas";
import { HERO_SCENES } from "./hero-scenes";

describe("use-case hero scenes", () => {
  // The first six pages kept their scenes here. Pages added since build
  // their hero in their own directory (src/components/personas/<slug>/), so
  // only the scenes that exist are held to being unique.
  it("gives each page with a scene a scene of its own", () => {
    const scenes = Object.values(HERO_SCENES);
    expect(new Set(scenes).size, "two pages share a scene").toBe(scenes.length);
  });

  it("keeps no scene for a page that no longer exists", () => {
    for (const slug of Object.keys(HERO_SCENES)) expect(PERSONA_SLUGS).toContain(slug);
  });
});
