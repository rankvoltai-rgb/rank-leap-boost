#!/usr/bin/env python3
"""
Copies finished renders from out/ into the ad-content library: one folder per
concept, with every variant of that concept inside it (sizes, use cases,
carousel slides) and its 2x masters in a high-res/ subfolder.

    python3 export.py                      # library path from export-dest.txt
    python3 export.py "/path/to/library"   # or name it

Run it after ./render.sh. When a new concept is made, add it to LIBRARY.
It only writes the files listed here: anything else in the library is left
alone, and a re-run replaces each listed file with its current render.
"""
import shutil
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
OUT = HERE / "out"

# Channel size per format, as render.sh writes it.
SIZE = {"4x3": "1600x1200", "4x5": "1080x1350", "1x1": "1080x1080", "9x16": "1080x1920"}
# Every size a showcase scene can come in, and what each is for.
SHOWCASE = [("4x3", "app-preview"), ("4x5", "feed"), ("1x1", "square"), ("9x16", "reel")]


def sizes(scene):
    """All the sizes a scene was rendered in; the ones it lacks are skipped."""
    return [(fmt, scene, name, True) for fmt, name in SHOWCASE]


def one(fmt, scene, name):
    return (fmt, scene, name, False)


def single(scene):
    return [one("4x3", scene, "app-preview")]


def v2(scene):
    """An ad cluster's variant type 2: one single image, in its own subfolder."""
    return one("4x5", scene, "Variant 2 - single image/single-image")


# Variant 3 ("Selected", the lead's freestyle posters) is on hold: the user
# found the freestyle work sloppy (2026-10-04). Scenes stay in scenes/v3-*;
# flip this on only if the user asks for them.
EXPORT_V3 = False


def v3(scene):
    """Variant type 3, "Selected": blue and white only, one single image."""
    return ("4x5", scene, "Variant 3 - blue and white/single-image", "v3")


def v4(scene):
    """Variant type 4, "Replica": a SaaS reference ad replicated with real Rankbox UI."""
    return (("4x5", scene, "Variant 4 - SaaS replica/single-image", True))


# (category, concept folder, files, extra files as (source, name))
LIBRARY = [
    # ---- Ad set: the user's brief, one folder per cluster ----
    ("Ad set", "Cluster 2 - The new name for the game (GEO)", [
        one("4x5", "c2-geo-1", "1-what-changed"),
        one("4x5", "c2-geo-2", "2-old-playbook"),
        one("4x5", "c2-geo-3", "3-what-replaces-it"),
        one("4x5", "c2-geo-4", "4-done-for-you"),
        v2("v2-c02-geo"),
        v3("v3-c02-geo"),
        v4("v4-c02-geo"),
    ], [("brief/c2-geo-ad-copy.txt", "ad-copy.txt")]),
    ("Ad set", "Cluster 3 - Why them and not me", [
        one("4x5", "c03-why-them-1", "1-not-in-the-answer"),
        one("9x16", "c03-why-them-1", "1-not-in-the-answer"),
        one("4x5", "c03-why-them-2", "2-its-structure"),
        one("9x16", "c03-why-them-2", "2-its-structure"),
        v2("v2-c03-why-them"),
        v3("v3-c03-why-them"),
        v4("v4-c03-why-them"),
    ], [("brief/c03-ad-copy.txt", "ad-copy.txt")]),
    ("Ad set", "Cluster 12 - What is the AI saying about you", [
        one("4x5", "c12-ai-says-1", "1-the-alert"),
        one("4x5", "c12-ai-says-2", "2-check-it-free"),
        v2("v2-c12-ai-says"),
        v3("v3-c12-ai-says"),
        v4("v4-c12-ai-says"),
    ], [("brief/c12-ad-copy.txt", "ad-copy.txt")]),
    ("Ad set", "Cluster 13 - The free shelf space (Shopify)", [
        one("4x5", "c13-shelf-space-1", "1-ai-picks-products"),
        one("9x16", "c13-shelf-space-1", "1-ai-picks-products"),
        one("4x5", "c13-shelf-space-2", "2-the-shelf-space"),
        one("9x16", "c13-shelf-space-2", "2-the-shelf-space"),
        v2("v2-c13-shelf-space"),
        v3("v3-c13-shelf-space"),
        v4("v4-c13-shelf-space"),
    ], [("brief/c13-ad-copy.txt", "ad-copy.txt")]),
    ("Ad set", "Cluster 23 - The citation people click (Perplexity)", [
        one("4x5", "c23-source-one-1", "1-people-click-sources"),
        one("4x5", "c23-source-one-2", "2-source-one-gets-the-visit"),
        one("4x5", "c23-source-one-3", "3-the-visit-arrives"),
        v2("v2-c23-source-one"),
        v3("v3-c23-source-one"),
        v4("v4-c23-source-one"),
    ], [("brief/c23-ad-copy.txt", "ad-copy.txt")]),
    ("Ad set", "Cluster 24 - The blueprint (AI search visibility)", [
        one("4x5", "c24-blueprint-1", "1-the-blueprint"),
        one("4x5", "c24-blueprint-2", "2-make-it-readable"),
        one("4x5", "c24-blueprint-3", "3-make-it-quotable"),
        one("4x5", "c24-blueprint-4", "4-answer-every-question"),
        one("4x5", "c24-blueprint-5", "5-rankbox-runs-it"),
        v2("v2-c24-blueprint"),
        v3("v3-c24-blueprint"),
        v4("v4-c24-blueprint"),
    ], [("brief/c24-ad-copy.txt", "ad-copy.txt")]),
    ("Ad set", "Cluster 29 - The second tab (pricing)", [
        one("4x5", "c29-second-tab-1", "1-pricing-page"),
        one("4x5", "c29-second-tab-2", "2-the-second-tab"),
        one("4x5", "c29-second-tab-3", "3-your-side"),
        v2("v2-c29-second-tab"),
        v3("v3-c29-second-tab"),
        v4("v4-c29-second-tab"),
    ], [("brief/c29-ad-copy.txt", "ad-copy.txt")]),
    ("Ad set", "Cluster 30 - The anonymous commenter (Reddit)", [
        one("4x5", "c30-old-comment-1", "1-the-old-comment"),
        one("4x5", "c30-old-comment-2", "2-its-fixable"),
        v2("v2-c30-old-comment"),
        v3("v3-c30-old-comment"),
        v4("v4-c30-old-comment"),
    ], [("brief/c30-ad-copy.txt", "ad-copy.txt")]),
    ("Ad set", "Cluster 33 - Rank 1, still invisible (AI Overviews)", [
        one("4x5", "c33-below-the-fold", "below-the-fold"),
        one("9x16", "c33-below-the-fold", "below-the-fold"),
        v2("v2-c33-below-the-fold"),
        v3("v3-c33-below-the-fold"),
        v4("v4-c33-below-the-fold"),
    ], [("brief/c33-ad-copy.txt", "ad-copy.txt")]),
    ("Ad set", "Cluster 36 - Ask your phone for a specialist (local)", [
        one("4x5", "c36-voice-law", "law-firm"),
        one("4x5", "c36-voice-dental", "dental-practice"),
        one("4x5", "c36-voice-medspa", "med-spa"),
        one("4x5", "c36-voice-contractor", "contractor"),
        v2("v2-c36-voice"),
        v3("v3-c36-voice"),
        v4("v4-c36-voice"),
    ], [("brief/c36-ad-copy.txt", "ad-copy.txt")]),
    ("Ad set", "Cluster 47 - The 40-word search", [
        one("4x5", "c47-long-search", "long-search"),
        v2("v2-c47-long-search"),
        v3("v3-c47-long-search"),
        v4("v4-c47-long-search"),
    ], [("brief/c47-ad-copy.txt", "ad-copy.txt")]),
    ("Ad set", "Cluster 6 - The invoice you regret (link building)", [
        one("4x5", "c06-retainer-invoice-1", "1-the-invoice"),
        one("4x5", "c06-retainer-invoice-2", "2-links-vs-answers"),
        one("4x5", "c06-retainer-invoice-3", "3-your-own-site"),
        v2("v2-c06-retainer-invoice"),
        v3("v3-c06-retainer-invoice"),
        v4("v4-c06-retainer-invoice"),
    ], [("brief/c06-ad-copy.txt", "ad-copy.txt")]),
    ("Ad set", "Cluster 9 - Old way vs new way (SEO agency)", [
        one("4x5", "c09-old-way-new-way", "old-way-new-way"),
        v2("v2-c09-old-way-new-way"),
        v3("v3-c09-old-way-new-way"),
        v4("v4-c09-old-way-new-way"),
    ], [("brief/c09-ad-copy.txt", "ad-copy.txt")]),
    ("Ad set", "Cluster 10 - Stop renting clicks (Google Ads)", [
        one("4x5", "c10-stop-renting", "stop-renting-clicks"),
        v2("v2-c10-stop-renting"),
        v3("v3-c10-stop-renting"),
        v4("v4-c10-stop-renting"),
    ], [("brief/c10-ad-copy.txt", "ad-copy.txt")]),
    ("Ad set", "Cluster 11 - Inbound didn't die, it moved (B2B)", [
        one("4x5", "c11-inbound-moved-1", "1-your-inbox"),
        one("4x5", "c11-inbound-moved-2", "2-where-buyers-went"),
        one("4x5", "c11-inbound-moved-3", "3-get-on-the-shortlist"),
        v2("v2-c11-inbound-moved"),
        v3("v3-c11-inbound-moved"),
        v4("v4-c11-inbound-moved"),
    ], [("brief/c11-ad-copy.txt", "ad-copy.txt")]),
    ("Ad set", "Cluster 15 - The press release nobody read", [
        one("4x5", "c15-press-release", "press-release-vs-month"),
        v2("v2-c15-press-release"),
        v3("v3-c15-press-release"),
        v4("v4-c15-press-release"),
    ], [("brief/c15-ad-copy.txt", "ad-copy.txt")]),
    ("Ad set", "Cluster 20 - Before you hire a fractional CMO", [
        one("4x5", "c20-before-cmo", "before-you-hire"),
        v2("v2-c20-before-cmo"),
        v3("v3-c20-before-cmo"),
        v4("v4-c20-before-cmo"),
    ], [("brief/c20-ad-copy.txt", "ad-copy.txt")]),
    ("Ad set", "Cluster 22 - CAC creep", [
        one("4x5", "c22-cac-creep", "cac-creep"),
        v2("v2-c22-cac-creep"),
        v3("v3-c22-cac-creep"),
        v4("v4-c22-cac-creep"),
    ], [("brief/c22-ad-copy.txt", "ad-copy.txt")]),
    ("Ad set", "Cluster 34 - Burner domains (cold email)", [
        one("4x5", "c34-burner-domains", "burner-domains"),
        v2("v2-c34-burner-domains"),
        v3("v3-c34-burner-domains"),
        v4("v4-c34-burner-domains"),
    ], [("brief/c34-ad-copy.txt", "ad-copy.txt")]),
    ("Ad set", "Cluster 35 - When did you last calculate CAC", [
        one("4x5", "c35-last-cac", "last-cac"),
        v2("v2-c35-last-cac"),
        v3("v3-c35-last-cac"),
        v4("v4-c35-last-cac"),
    ], [("brief/c35-ad-copy.txt", "ad-copy.txt")]),
    ("Ad set", "Cluster 40 - The 500 dollar link (guest posts)", [
        one("4x5", "c40-500-link", "the-500-link"),
        v2("v2-c40-500-link"),
        v3("v3-c40-500-link"),
        v4("v4-c40-500-link"),
    ], [("brief/c40-ad-copy.txt", "ad-copy.txt")]),
    ("Ad set", "Cluster 45 - The whitepaper nobody downloads (demand gen)", [
        one("4x5", "c45-two-funnels", "two-funnels"),
        v2("v2-c45-two-funnels"),
        v3("v3-c45-two-funnels"),
        v4("v4-c45-two-funnels"),
    ], [("brief/c45-ad-copy.txt", "ad-copy.txt")]),

    # ---- Freestyle: own concepts, no reference ----
    ("Freestyle", "01 Your customers are asking AI", [
        one("4x3", "f01-buyers-ask-ai", "landscape"),
    ], []),
    ("Freestyle", "02 Paste your website, get a month of content", [
        one("9x16", "f02-month-bbq", "restaurant"),
        one("9x16", "f02-month-coffee", "online-store"),
        one("9x16", "f02-month-saas", "saas"),
        one("9x16", "f02-month-dental", "dental-practice"),
    ], []),
    ("Freestyle", "03 Get AI traffic on autopilot", [
        one("4x5", "f03-autopilot-orbit", "feed"),
        one("9x16", "f03-autopilot-orbit", "reel"),
    ], []),
    ("Freestyle", "04 Less than one freelance article (receipt)", [
        one("4x5", "f04-receipt", "feed"),
        one("9x16", "f04-receipt", "reel"),
    ], []),

    # ---- Product showcase: app previews and social, after the references ----
    ("Product showcase", "01 Get AI traffic on autopilot", sizes("01-hero"), []),
    ("Product showcase", "02 Answer what buyers ask AI", sizes("02-questions"), []),
    ("Product showcase", "03 New articles land every day", sizes("03-publish"), []),
    ("Product showcase", "04 A month of content from one URL", sizes("04-setup"), []),
    ("Product showcase", "05 MCP server, one URL", sizes("05-mcp"), []),
    ("Product showcase", "06 Free MCP tools in an AI chat", sizes("06-chat"), []),
    ("Product showcase", "07 Rankbox for Framer", sizes("07-framer"), []),
    ("Product showcase", "08 Rank Framer sites in AI search", sizes("08-framer-editor"), []),
    ("Product showcase", "09 Get AI traffic on autopilot (isometric)", single("09-iso-hero"), []),
    ("Product showcase", "10 Seven features beside the editor", single("10-feature-pills"), []),
    ("Product showcase", "11 Skip the guesswork", single("11-guesswork"), []),
    ("Product showcase", "12 Written for Google and AI", single("12-everywhere"), []),
    ("Product showcase", "13 What buyers ask AI, what engines look for", single("13-plugin-panels"), []),
    ("Product showcase", "14 Sync AI articles into Framer CMS", single("14-sync-flow"), []),
    ("Product showcase", "15 Drag articles between days", single("15-calendar-drag"), []),
    ("Product showcase", "16 Articles that sound like your brand", single("16-three-voices"), []),
    ("Product showcase", "17 One platform for search and AI traffic", single("17-bento"), []),
    ("Product showcase", "18 Power up your Framer blog", single("18-power-up"), []),
    ("Product showcase", "19 Full articles plus meta and schema", single("19-chips-editor"), []),
    ("Product showcase", "20 Three steps to a month of content", single("20-three-steps"), []),
    ("Product showcase", "21 Scored for Google and AI answers", single("21-two-scores"), []),
    ("Product showcase", "22 Use Rankbox in the AI you already pay for", single("22-your-ai"), []),
    ("Product showcase", "23 Select a line, rewrite it in one click", single("23-select-edit"), []),
    ("Product showcase", "24 Know what every article costs", single("24-cost-history"), []),
    ("Product showcase", "25 SEO score beside the article", single("25-seo-score"), []),
    ("Product showcase", "26 Welcome to Rankbox", single("26-welcome"), []),
    ("Product showcase", "27 Research, writing, publishing", single("27-three-words"), []),
    ("Product showcase", "28 Get AI traffic from ChatGPT", single("28-traffic-from"), []),
    ("Product showcase", "29 Publish to Framer, Webflow and more", single("29-integrations"), []),
    ("Product showcase", "30 Let AI crawlers read your site", single("30-ai-crawlers"), []),
    ("Product showcase", "31 Structured data in your site's head", [
        one("4x3", "31-head-code-dark", "dark"),
        one("4x3", "32-head-code-light", "light"),
    ], []),
    ("Product showcase", "33 Content calendar", single("33-calendar"), []),
    ("Product showcase", "34 Tell Rankbox who you are", single("34-brand-form"), []),
    ("Product showcase", "35 Your site's theme, light or dark", single("35-light-dark"), []),
]


def pixel_size(path):
    out = subprocess.run(["sips", "-g", "pixelWidth", "-g", "pixelHeight", str(path)],
                         capture_output=True, text=True, check=True).stdout
    vals = [line.split(":")[1].strip() for line in out.splitlines() if "pixel" in line]
    return f"{vals[0]}x{vals[1]}"


def main():
    if len(sys.argv) > 1:
        dest = Path(sys.argv[1])
    else:
        cfg = HERE / "export-dest.txt"
        if not cfg.exists():
            sys.exit("Name the library folder: python3 export.py \"/path/to/library\"")
        dest = Path(cfg.read_text().strip())
    if not dest.is_dir():
        sys.exit(f"Library folder not found: {dest}")

    copied, missing = 0, []
    for category, concept, files, extras in LIBRARY:
        folder = dest / category / concept
        for fmt, scene, name, optional in files:
            if optional == "v3" and not EXPORT_V3:
                continue
            src = OUT / fmt / f"rankbox-{scene}.png"
            if not src.exists():
                if not optional:
                    missing.append(f"{fmt}/{scene}")
                continue
            target = folder / f"{name}-{SIZE[fmt]}.png"
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, target)
            copied += 1
            master = OUT / f"{fmt}@2x" / f"rankbox-{scene}.png"
            if master.exists():
                hi = target.parent / "high-res"
                hi.mkdir(exist_ok=True)
                shutil.copy2(master, hi / f"{Path(name).name}-{pixel_size(master)}.png")
        for src_name, name in extras:
            src = HERE / src_name
            if src.exists():
                folder.mkdir(parents=True, exist_ok=True)
                shutil.copy2(src, folder / name)
            else:
                missing.append(src_name)

    print(f"Copied {copied} images into {len(LIBRARY)} concept folders in {dest}")
    if missing:
        print("Not rendered yet (run ./render.sh):", ", ".join(missing))
        sys.exit(1)


if __name__ == "__main__":
    main()
