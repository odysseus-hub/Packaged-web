type Glyph = "hash" | "bell" | "chat" | "grid" | "siren" | "branch" | "fox" | "tri" | "line" | "ticket" | "dog" | "hook";

const integrations: { name: string; kind: string; glyph: Glyph }[] = [
  { name: "Slack", kind: "Chat", glyph: "hash" },
  { name: "PagerDuty", kind: "On-call", glyph: "bell" },
  { name: "Discord", kind: "Chat", glyph: "chat" },
  { name: "MS Teams", kind: "Chat", glyph: "grid" },
  { name: "Opsgenie", kind: "On-call", glyph: "siren" },
  { name: "GitHub", kind: "Checks as code", glyph: "branch" },
  { name: "GitLab", kind: "Checks as code", glyph: "fox" },
  { name: "Vercel", kind: "Deploy hooks", glyph: "tri" },
  { name: "Linear", kind: "Issues", glyph: "line" },
  { name: "Jira", kind: "Issues", glyph: "ticket" },
  { name: "Datadog", kind: "Metrics export", glyph: "dog" },
  { name: "Webhooks", kind: "Anything else", glyph: "hook" },
];

function GlyphIcon({ g }: { g: Glyph }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 2.4, strokeLinecap: "square" as const };
  const paths: Record<Glyph, React.ReactNode> = {
    hash: <path {...common} d="M9 4 7 20M17 4l-2 16M4 9h16M3 15h16" />,
    bell: <path {...common} d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4" />,
    chat: <path {...common} d="M4 5h16v11H9l-5 4z" />,
    grid: <path {...common} d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />,
    siren: <path {...common} d="M6 19v-6a6 6 0 0 1 12 0v6M4 19h16M12 3v2M4.5 6.5 6 8M19.5 6.5 18 8" />,
    branch: <path {...common} d="M7 4v16M7 14c0-4 10-2 10-7M17 4v3" />,
    fox: <path {...common} d="M4 9 12 20 20 9 17 3l-2 6H9L7 3z" />,
    tri: <path {...common} d="M12 4 21 20H3z" />,
    line: <path {...common} d="M4 14 10 20M4 9l11 11M6 5l13 13M11 4l9 9" />,
    ticket: <path {...common} d="M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4zM14 7v10" />,
    dog: <path {...common} d="M5 6l3 3h8l3-3v9l-3 5H8l-3-5zM10 13h0M14 13h0" />,
    hook: <path {...common} d="M12 3v10a4 4 0 1 1-4-4M12 3l3 3" />,
  };
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
      {paths[g]}
    </svg>
  );
}

export default function Integrations() {
  return (
    <section id="integrations" className="border-y-2 border-ink bg-paper text-ink">
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <div className="reveal flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="fade-up display text-[clamp(2.5rem,7vw,6.5rem)]">
            Yells where
            <br />
            you <span className="text-volt">listen.</span>
          </h2>
          <p className="fade-up max-w-sm text-lg leading-relaxed text-ink/75">
            Two-click integrations with the tools your team already lives in. Anything else gets a signed webhook.
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-2 border-l-2 border-t-2 border-ink sm:grid-cols-3 lg:mt-16 lg:grid-cols-6">
          {integrations.map((i) => (
            <li
              key={i.name}
              className="group flex flex-col justify-between gap-6 border-b-2 border-r-2 border-ink p-5 transition-colors hover:bg-ink hover:text-paper sm:p-6"
            >
              <span className="text-ink/80 transition-colors group-hover:text-volt">
                <GlyphIcon g={i.glyph} />
              </span>
              <span>
                <span className="display-tight block text-[1.3rem] sm:text-2xl">{i.name}</span>
                <span className="mt-1 block font-mono text-[11px] uppercase tracking-wider text-ash group-hover:text-paper/60">
                  {i.kind}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
