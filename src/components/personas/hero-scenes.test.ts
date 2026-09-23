import { describe, expect, it } from "vitest";
import { PERSONA_SLUGS } from "@/data/personas";
import { HERO_SCENES } from "./hero-scenes";

describe("use-case hero scenes", () => {
  it("gives every use-case page a scene of its own", () => {
    for (const slug of PERSONA_SLUGS) expect(HERO_SCENES[slug], slug).toBeDefined();
    const scenes = PERSONA_SLUGS.map((slug) => HERO_SCENES[slug]);
    expect(new Set(scenes).size, "two pages share a scene").toBe(scenes.length);
  });

  it("keeps no scene for a page that no longer exists", () => {
    for (const slug of Object.keys(HERO_SCENES)) expect(PERSONA_SLUGS).toContain(slug);
  });
});
