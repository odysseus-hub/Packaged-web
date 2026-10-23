#!/usr/bin/env python3
"""Build the ChatGPT editions of the premium-site skill from skills/premium-site.

Outputs (dist/chatgpt/):
  premium-site/                     Agent Skills folder adapted for ChatGPT / Codex (+ agents/openai.yaml)
  premium-site-chatgpt-skill.zip    the same folder, zipped (upload/install as a skill)
  premium-site-custom-gpt-kit.zip   the Custom GPT kit, zipped
  custom-gpt/                       Custom GPT kit: INSTRUCTIONS.md (<8000 chars), knowledge/ (<20 files),
                                    CONVERSATION_STARTERS.md
  README.md                         setup for each route

Re-run after any change to the skill:  python3 tools/build_chatgpt.py
"""
import re
import shutil
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "skills" / "premium-site"
OUT = ROOT / "dist" / "chatgpt"
SKILL = OUT / "premium-site"
GPT = OUT / "custom-gpt"


def must_sub(text, old, new, label):
    if old not in text:
        raise SystemExit(f"build_chatgpt: anchor not found in {label}: {old[:70]!r}")
    return text.replace(old, new)


def adapt_skill_md(s):
    s = must_sub(
        s,
        "  motion, VFX, shaders, a 3D product spin or a palette switch. Hands scroll-linked polish to\n  the flowy skill.",
        "  motion, VFX, shaders, a 3D product spin or a palette switch. Includes a scroll-linked layer\n  playbook (smooth scroll, parallax, pinning).",
        "SKILL.md description",
    )
    # Where-this-runs section, right before the workflow.
    s = must_sub(
        s,
        "## Workflow\n",
        """## Where this runs (ChatGPT / Codex)

`<skill>` below means this skill's folder: for example `~/.codex/skills/premium-site` or
`~/.agents/skills/premium-site` in Codex, or wherever ChatGPT mounted it (often under
`/home/oai/skills/`). Find it by locating this `SKILL.md`.

- **A shell with Node 20+ and network** (Codex CLI, IDE, desktop): run the scripts as written.
- **A sandbox without npm or network** (ChatGPT's code tool): don't pretend to scaffold or
  build. Write the full project files (start from `assets/`; the templates are real, tested
  source), package them as a downloadable zip, and give the user the exact commands
  (`scaffold.sh` flags, `npm install`, `npm run build`, `check_site.py`, `screenshot.mjs`) to
  run locally. Say plainly which checks you could not run.
- Copy component source from `assets/` rather than re-deriving it. Each file passed lint,
  typecheck, build and a browser test.

## Workflow
""",
        "SKILL.md workflow",
    )
    s = must_sub(
        s,
        "Lenis isn't installed by default: smooth scroll belongs to the flowy pass in step 5, which\nadds `lenis` and copies `assets/motion/smooth-scroll.tsx` back in. Pass `--lenis` only if\nyou're skipping flowy and still want inertial scroll.",
        "Lenis isn't installed by default: smooth scroll belongs to the scroll-linked layer in step 5,\nwhich adds `lenis` and copies `assets/motion/smooth-scroll.tsx` back in (or pass `--lenis`\nup front).",
        "SKILL.md lenis",
    )
    start = s.index("### 5. Hand off scroll-linked polish to flowy")
    end = s.index("### 6. Verify, then deploy")
    s = s[:start] + """### 5. Add the scroll-linked layer

This skill's first pass owns **time-based** motion: entrances, staggers, hovers, in-view
reveals. **Scroll-linked** motion is a separate layer, added once the page passes step 6's
checks: smooth or inertial scroll, parallax, scroll-scrubbed reveals, pinned or horizontal
sections, marquees, and section-to-section continuity.

Follow `references/scroll-layer.md`. Pick one dominant scroll idea per section, all on
Motion's clock (`useScroll`/`useTransform`, sticky pins, Lenis driven by `frame.setup`). Never
add GSAP alongside Motion: two animation clocks on one page cause jank. If a `flowy` skill is
installed, you can hand it the brief in that file instead.

If time is short, ship without scroll-linked effects and say so. A clean page with good
entrances beats a half-wired parallax.

""" + s[end:]
    s = s.replace("- what flowy added, or why it was skipped", "- what the scroll layer added, or why it was skipped")
    s = s.replace("| What to hand flowy and how to keep one animation clock | `references/flowy-handoff.md` |",
                  "| Scroll-linked layer: pins, parallax, scrub, marquee, Lenis, on one clock | `references/scroll-layer.md` |")
    return s


def adapt_scroll_layer(s):
    s = must_sub(s, "# Handing scroll-linked polish to flowy", "# The scroll-linked layer", "flowy-handoff title")
    s = re.sub(
        r"\*\*Split of responsibilities:\*\*.*?\n\n",
        "**Split of responsibilities:** the first pass builds the page and its time-based motion. This\n"
        "layer adds scroll-linked motion on top, once the page builds clean and the screenshots look\n"
        "right without scroll effects. It's a polish pass, not a rescue.\n\n",
        s, count=1, flags=re.S,
    )
    s = s.replace("## When to hand off", "## When to add it").replace("Hand off if the art direction", "Add it if the art direction")
    s = s.replace("Skip the handoff (and say so in the report)", "Skip this layer (and say so in the report)")
    start = s.index("## How")
    end = s.index("Mark targets in markup")
    s = s[:start] + """## How

Do it yourself with the rules and recipes below; `references/vfx-recipes.md` has the
tested pieces (flood, stacking, pinned rows, velocity skew). If a `flowy` skill is installed,
you may instead give it this brief, filled in, in its "adapt an existing project" mode:

```markdown
## Scroll layer brief: <site>
Project: <path>, Next.js 16 App Router, Tailwind v4, shadcn/ui.
Motion stack ALREADY PRESENT: `motion` (motion.dev), imported from "motion/react".
  → Stay on Motion. No GSAP/ScrollTrigger unless an effect is impossible in Motion (justify it).
Motion tokens: src/components/motion/tokens.ts. Reuse them.
Reduced motion: <MotionConfig reducedMotion="user"> in layout. Keep scroll effects off under reduce.
Already animated (don't re-animate): hero entrance, section entrances (whileInView once),
  hovers, charts (InViewMount).
Smooth scroll: `npm i lenis`, copy assets/motion/smooth-scroll.tsx (Lenis on Motion's
  frame.setup, one clock), mount <SmoothScroll /> once in layout, import "lenis/dist/lenis.css".
Visual theme: final. Do not change colors, type or imagery.

| Section (selector) | Effect | Notes |
|---|---|---|
```

Rules for this layer:
- **One dominant idea per section.** Generous still space between them is part of the effect.
- **Pins always release.** Never trap the scroll, hijack keyboard or anchor navigation, or
  block reading until an animation finishes.
- **Measure travel from rendered geometry** (ResizeObserver), never guessed viewport math.
- **One smooth-scroll controller,** with `scroll-behavior: smooth` removed from CSS.
- **Reduced motion:** keep the same elements and style objects, and map motion values to
  their resting state. Pinned rows become plain grids.

""" + s[end:]
    s = s.replace("expect flowy to drive", "expect the scroll layer to drive")
    s = s.replace("## GSAP recipe → Motion equivalent (flowy's patterns are written in GSAP)",
                  "## GSAP recipe → Motion equivalent (most tutorials are written in GSAP)")
    s = s.replace("| flowy (GSAP) | Motion for React |", "| GSAP | Motion for React |")
    s = s.replace("## After flowy returns", "## After the layer is in")
    s = s.replace("If the brief includes smooth scroll, flowy must also remove", "If you add smooth scroll, also remove")
    return s


def neutralize_flowy(s):
    s = s.replace("**flowy**", "**the scroll layer**")
    s = s.replace("hand the marquee to flowy** (it has velocity-reactive marquees)", "hand the marquee to the scroll layer** (velocity-reactive marquee recipe)")
    s = s.replace("hand it to flowy", "hand it to the scroll layer")
    s = s.replace("`data-flowy=", "`data-scroll=")
    s = s.replace("Lenis (if flowy adds it)", "Lenis (if the scroll layer adds it)")
    s = s.replace("lets flowy add scroll polish later", "lets the scroll layer add polish later")
    s = s.replace("belongs to flowy", "belongs to the scroll layer")
    s = s.replace("flowy maps\n  GSAP recipes onto Motion.", "`references/scroll-layer.md`\n  maps GSAP recipes onto Motion.")
    s = s.replace("references/flowy-handoff.md", "references/scroll-layer.md")
    return s


def build_skill():
    if OUT.exists():
        shutil.rmtree(OUT)
    shutil.copytree(SRC, SKILL)
    (SKILL / "SKILL.md").write_text(adapt_skill_md((SKILL / "SKILL.md").read_text()))
    fh = SKILL / "references" / "flowy-handoff.md"
    (SKILL / "references" / "scroll-layer.md").write_text(adapt_scroll_layer(fh.read_text()))
    fh.unlink()
    for p in list((SKILL / "references").glob("*.md")) + [SKILL / "SKILL.md"]:
        p.write_text(neutralize_flowy(p.read_text()))
    sc = SKILL / "scripts" / "scaffold.sh"
    sc.write_text(sc.read_text().replace("(only if you are NOT handing smooth scroll to the flowy skill)", "(smooth scroll up front instead of in the scroll layer)")
                  .replace("# needs lenis; flowy adds it", "# needs lenis; the scroll layer adds it"))
    for p, a, b in [
        (SKILL / "assets/motion/reveal.tsx", "that is the flowy skill's job.", "that is the scroll layer's job (references/scroll-layer.md)."),
        (SKILL / "assets/motion/smooth-scroll.tsx", "for the flowy handoff", "for the scroll layer"),
    ]:
        t = p.read_text()
        p.write_text(must_sub(t, a, b, p.name))
    (SKILL / "agents").mkdir()
    (SKILL / "agents" / "openai.yaml").write_text(
        """interface:
  display_name: "Premium Site"
  short_description: "Award-level animated marketing sites: Next.js, Tailwind, shadcn/ui, Motion, Kokonut UI, Bklit charts, shader heroes and scroll-pinned 3D products."
  brand_color: "#EB5116"
  default_prompt: "Use the premium-site skill to art-direct and build an animated marketing site."
policy:
  allow_implicit_invocation: true
"""
    )
    leftovers = [str(p.relative_to(SKILL)) for p in SKILL.rglob("*") if p.is_file() and p.suffix in {".md", ".sh"} and re.search(r"\bflowy\b", p.read_text()) and p.name != "scroll-layer.md"]
    if leftovers:
        print("note: 'flowy' still mentioned (intentional optional handoff) in:", leftovers)
    with zipfile.ZipFile(OUT / "premium-site-chatgpt-skill.zip", "w", zipfile.ZIP_DEFLATED) as z:
        for p in sorted(SKILL.rglob("*")):
            if p.is_file():
                z.write(p, Path("premium-site") / p.relative_to(SKILL))


def code_doc(title, intro, files):
    out = [f"# {title}\n", intro.strip() + "\n"]
    for p in files:
        lang = {".tsx": "tsx", ".ts": "ts", ".sh": "bash", ".py": "python", ".mjs": "js", ".md": "markdown"}.get(p.suffix, "")
        out.append(f"\n## `{p.relative_to(SKILL)}`\n\n```{lang}\n{p.read_text().rstrip()}\n```\n")
    return "\n".join(out)


GPT_INSTRUCTIONS = """You are Premium Site, an art director and senior front-end engineer. You build award-level, animated marketing websites on a fixed stack: Next.js (App Router) + Tailwind v4 + shadcn/ui, Motion (motion.dev, import from "motion/react") for animation, Kokonut UI (shadcn registry @kokonutui) for animated components, Bklit UI (registry @bklit) for charts, optional three.js + React Three Fiber for one 3D product moment, deployed to Vercel.

Your knowledge files are the full playbook. 01-SKILL.md is the workflow. The references hold the details. The code-*.md files hold tested source you copy rather than re-derive. Search them before answering; quote exact versions, commands and gotchas from them.

ORDER OF WORK (never skip ahead)
1. Art direction first. Fill the art-direction template: one bold concept sentence (a world, not a feeling); one characterful display face plus one quiet text face (next/font); what the hero shows (generative shader, the product, photography or type-as-image; never "nothing"); exactly three color tokens (--paper, --ink, --brand in OKLCH, everything else derived with color-mix(); accent under 10% of a screen; check contrast for every palette); section padding of at least clamp(6rem,12vw,11rem). If the user is vague, choose confidently and state it. Avoid the generic look: centered everything, purple-blue gradients, three identical icon cards, fade-up on every element, display type under 64px, emoji icons.
2. Scaffold with scripts/scaffold.sh (flags --dark --fx --3d --kokonut "…" --bklit "…"). It patches registry bugs, copies the Motion primitives, relaxes lint only on vendored registry code, and maps font variables.
3. Section map: every section gets a job, a component (section-map.md) and ONE motion idea. Vary layouts. One hero moment and one signature interaction per page, chosen from vfx-recipes.md. 3D ties to scroll (3d-product.md), never a floating trophy. Charts are proof, with a headline stating what they prove.
4. Motion rules: timing from tokens (expo-out, about 0.6s, 12-24px travel, 40-140ms stagger); springs for anything the pointer touches; hero runs on mount and everything else runs once in view; animate only transform and opacity; every WebGL/canvas/R3F loop pauses offscreen and freezes under reduced motion; MotionConfig reducedMotion="user"; use usePrefersReducedMotion() when reduced motion changes markup (avoids hydration error #418). The headline must be readable within 1.5s.
5. Scroll-linked layer last (scroll-layer.md): Lenis on Motion's frame loop, pins that release, one dominant idea per section, never GSAP alongside Motion.
6. Verify: eslint, next build, check_site.py, screenshot.mjs (desktop, 390px mobile, reduced motion). Look at the screenshots.

WHERE CODE RUNS
Your sandbox usually cannot npm-install or reach the network. Do not claim you scaffolded, built or tested anything you didn't run. Instead:
- Produce complete, copy-paste-ready files (no placeholders, no "…rest of code"). When there are many files, write them into a folder with the code tool and give the user a downloadable .zip.
- Give the exact local commands: npx create-next-app / scaffold.sh flags, npm install, npm run build, python3 check_site.py, node screenshot.mjs, npx vercel --prod.
- List which checks the user still needs to run.

VERSIONS AND GOTCHAS (from stack-setup.md; re-check if the user reports drift)
Verified Oct 2026: next 16.4, tailwind 4.3, shadcn 4.22 (base-nova), motion 14.4, three 0.186, @react-three/fiber 9.8 (peers on react >=19 <19.4), drei 10.7. Kokonut components default-export from @/components/kokonutui/<name>. Bklit installs per-file into @/components/charts/* (not "@bklitui/ui/charts"). Wrap charts in InViewMount. Use `new Date()` only in client components (it breaks the Next 16 build under cacheComponents). Start servers with ./node_modules/.bin/next start and stop them with `pkill -P $PID; kill $PID`. Motion+ components (Ticker, AnimateNumber, ScrambleText, splitText) are paid; use the free equivalents in code-fx-library.md.

DELIVERABLE REPORT
End every build with: the concept sentence, type pairing, palette tokens, section map (section → component → motion idea), dependencies added, reduced-motion behavior, what was verified (and what wasn't), what the scroll layer added, and the deploy command.

STYLE
Decisive and concrete. Show code, not descriptions of code. Explain the why behind design choices in one line each. If a request would make the site generic or inaccessible, say so and offer the premium alternative.
"""

STARTERS = """# Conversation starters (paste into the GPT builder)

1. Build me a cinematic dark landing page for my AI color-grading app. Hero like film opening titles.
2. Make a loud, high-energy product page for my API monitoring startup, with charts that prove the speed.
3. I sell canned cold brew: give me a scroll-pinned 3D can that spins and changes flavor.
4. Audit my Next.js landing page: why does it look generic, and what would make it premium?

## Recommended GPT settings
- Capabilities: **Web Search ON** (to check versions and docs), **Code Interpreter & Data Analysis ON** (to write files and zip projects), **Canvas ON** (for editing long files). Image generation is optional (moodboards and hero art).
- Knowledge: upload every file in `knowledge/`, plus `../premium-site-chatgpt-skill.zip` if you want the GPT to copy real asset files into downloadable projects.
"""


def build_gpt():
    k = GPT / "knowledge"
    k.mkdir(parents=True)
    shutil.copy(SKILL / "SKILL.md", k / "01-SKILL.md")
    for i, p in enumerate(sorted((SKILL / "references").glob("*.md")), start=2):
        shutil.copy(p, k / f"{i:02d}-{p.name}")
    n = 2 + len(list((SKILL / "references").glob("*.md")))
    A = SKILL / "assets"
    docs = [
        ("code-motion-primitives.md", "Motion primitives & templates",
         "Tested source. Copy into `src/components/motion/` (scaffold.sh does this) and the layout and art-direction templates.",
         sorted((A / "motion").glob("*")) + sorted((A / "templates").glob("*"))),
        ("code-fx-library.md", "Signature-effects library",
         "Tested source for `src/components/fx/` and `src/components/palette/` (scaffold.sh --fx). See vfx-recipes.md for when and how to use each.",
         sorted((A / "fx").glob("*")) + sorted((A / "palette").glob("*"))),
        ("code-3d-product.md", "3D product scene",
         "Tested source for `src/components/3d/` (scaffold.sh --3d). See 3d-product.md for the section wrapper, choreography and mobile camera.",
         sorted((A / "3d").glob("*"))),
        ("code-scripts.md", "Scripts",
         "Run locally from the skill folder. scaffold.sh needs Node 20+ and network. check_site.py is a static audit. screenshot.mjs needs Playwright.",
         sorted((SKILL / "scripts").glob("*"))),
    ]
    for j, (name, title, intro, files) in enumerate(docs):
        (k / f"{n + j:02d}-{name}").write_text(code_doc(title, intro, files))
    (GPT / "INSTRUCTIONS.md").write_text(GPT_INSTRUCTIONS)
    (GPT / "CONVERSATION_STARTERS.md").write_text(STARTERS)
    count = len(list(k.iterdir()))
    chars = len(GPT_INSTRUCTIONS)
    assert chars <= 8000, f"instructions {chars} chars > 8000"
    assert count <= 20, f"{count} knowledge files > 20"
    return chars, count


README = """# premium-site for ChatGPT

Two ways to use the skill in ChatGPT, built from `skills/premium-site` by `tools/build_chatgpt.py`.

## Option A: as a Skill (ChatGPT Skills / Codex). Recommended where available
Skills use the same open Agent Skills format (a folder with `SKILL.md`) in ChatGPT and Codex.
This edition is adapted:
- `agents/openai.yaml` adds a display name, description, brand color and implicit invocation.
- The flowy-skill dependency is replaced by a self-contained `references/scroll-layer.md`.
- A "Where this runs" section tells the model what to do in a sandbox without npm or network.

- **ChatGPT:** open **Skills** (sidebar in the desktop app, or Settings → Skills) → upload or install
  `premium-site-chatgpt-skill.zip`. Invoke it with `@premium-site` or just ask for a landing page.
  (Skills availability varies by plan; reports list Business/Enterprise/Edu, with a beta on other plans.)
- **Codex CLI / IDE:** unzip into `~/.codex/skills/` (or `~/.agents/skills/`, or `.agents/skills/` in a repo):
  `unzip premium-site-chatgpt-skill.zip -d ~/.codex/skills/`. Codex can run the scripts directly.

## Option B: as a Custom GPT (any paid plan)
1. Go to ChatGPT → **Explore GPTs → Create → Configure**.
2. **Name:** Premium Site · **Description:** "Art-directs and builds award-level animated marketing sites (Next.js, Motion, shaders, 3D)."
3. **Instructions:** paste `custom-gpt/INSTRUCTIONS.md` (under the 8,000-character limit).
4. **Knowledge:** upload every file in `custom-gpt/knowledge/` (under 20 files). Optionally also upload
   `premium-site-chatgpt-skill.zip`, so the GPT can copy the real asset files into project zips.
5. **Capabilities:** Web Search ON, Code Interpreter ON, Canvas ON.
6. **Conversation starters:** from `custom-gpt/CONVERSATION_STARTERS.md`.

## What carries over and what doesn't
- **Carries over:** the full workflow, art direction, motion rules, section map, effects library, 3D playbook,
  2026 research, and every tested source file.
- **Runs only where there's a shell with Node and network** (Codex, your machine):
  `scaffold.sh`, `npm install`, `next build`, `screenshot.mjs`. In ChatGPT's sandbox the model writes the files,
  zips them, and gives you the commands. It's instructed not to claim builds it couldn't run.
"""


if __name__ == "__main__":
    build_skill()
    chars, count = build_gpt()
    (OUT / "README.md").write_text(README)
    with zipfile.ZipFile(OUT / "premium-site-custom-gpt-kit.zip", "w", zipfile.ZIP_DEFLATED) as z:
        for p in sorted(GPT.rglob("*")):
            if p.is_file():
                z.write(p, Path("premium-site-custom-gpt") / p.relative_to(GPT))
        z.write(OUT / "README.md", Path("premium-site-custom-gpt") / "README.md")
    print(f"skill → {SKILL}  zip → {OUT / 'premium-site-chatgpt-skill.zip'}")
    print(f"custom GPT: instructions {chars} chars, {count} knowledge files")
