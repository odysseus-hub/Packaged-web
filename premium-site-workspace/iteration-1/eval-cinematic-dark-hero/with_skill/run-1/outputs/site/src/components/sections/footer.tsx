export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-hairline pt-20">
      <div className="container-x grid gap-10 pb-12 text-sm sm:grid-cols-3">
        <div>
          <p className="font-mono text-[0.68rem] tracking-[0.2em] text-muted-foreground uppercase">Nocturne Labs</p>
          <p className="mt-3 max-w-[30ch] text-muted-foreground">
            AI color grading for people who make films with small crews and big ideas.
          </p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-2 text-muted-foreground">
          <a className="link-draw w-fit hover:text-foreground" href="#how">How it works</a>
          <a className="link-draw w-fit hover:text-foreground" href="#looks">Looks</a>
          <a className="link-draw w-fit hover:text-foreground" href="#speed">Render speed</a>
          <a className="link-draw w-fit hover:text-foreground" href="#pricing">Pricing</a>
          <a className="link-draw w-fit hover:text-foreground" href="#faq">FAQ</a>
          <a className="link-draw w-fit hover:text-foreground" href="#waitlist">Waitlist</a>
        </nav>
        <p className="font-mono text-[0.68rem] tracking-[0.2em] text-muted-foreground uppercase sm:text-right">
          © 2026 Nocturne Labs
          <br />
          Fin.
        </p>
      </div>
      <p
        aria-hidden="true"
        className="pointer-events-none -mb-[0.22em] text-center font-display text-[clamp(6rem,27vw,26rem)] leading-[0.8] tracking-[-0.05em] text-foreground/[0.07] italic select-none"
      >
        Nocturne
      </p>
    </footer>
  );
}
