# premium-site for ChatGPT

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
