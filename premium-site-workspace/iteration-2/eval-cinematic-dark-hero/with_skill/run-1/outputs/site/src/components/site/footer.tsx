const CREDITS = [
  ["Product", [["How it works", "#how"], ["Looks", "#looks"], ["Pricing", "#pricing"], ["FAQ", "#faq"]]],
  ["Studio", [["Waitlist", "#waitlist"], ["Press kit", "mailto:press@nocturne.film"], ["Contact", "mailto:hello@nocturne.film"]]],
] as const;

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-hairline bg-black pt-24">
      <div className="container-x grid gap-12 sm:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="slate text-muted-foreground">End credits</p>
          <p className="mt-4 max-w-[36ch] text-pretty text-muted-foreground">
            Nocturne is an AI colorist built for people who make films with small crews and
            long nights.
          </p>
        </div>
        {CREDITS.map(([title, links]) => (
          <nav key={title} aria-label={title} className="lg:col-span-3">
            <p className="slate text-[0.65rem] text-muted-foreground">{title}</p>
            <ul className="mt-4 space-y-2">
              {links.map(([label, href]) => (
                <li key={label}>
                  <a href={href} className="draw-link text-foreground/90 hover:text-foreground">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <p
        aria-hidden="true"
        className="mt-20 select-none text-center font-display text-[22vw] leading-[0.8] tracking-[-0.05em] text-foreground/[0.07]"
      >
        Nocturne
      </p>
      <div className="container-x slate relative flex justify-between pt-2 pb-6 text-[0.6rem] text-muted-foreground">
        <span>© 2026 Nocturne</span>
        <span>Fin.</span>
      </div>
    </footer>
  );
}
