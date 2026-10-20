import GradedFrame from "./GradedFrame";
import Timecode from "./Timecode";
import { looks } from "./looks";

export default function Hero() {
  const look = looks[0];
  return (
    <section id="top" className="grain relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-black">
      {/* Background plate */}
      <div className="anim-fade absolute inset-0">
        <div className="anim-kenburns absolute inset-0">
          <GradedFrame id="hero" filter={`${look.filter} brightness(0.55)`} overlay={look.overlay} blend={look.blend} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80" />
        <div className="vignette absolute inset-0" />
        {/* anamorphic light sweep */}
        <div className="anim-sweep pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-ember/25 to-transparent blur-2xl" />
      </div>

      {/* Letterbox bars */}
      <div
        className="anim-letterbox absolute inset-x-0 top-0 z-30 bg-black [--bar:7vh] md:[--bar:11vh]"
        aria-hidden
      />
      <div
        className="anim-letterbox absolute inset-x-0 bottom-0 z-30 bg-black [--bar:7vh] md:[--bar:11vh]"
        aria-hidden
      />

      {/* Opening credit */}
      <p className="anim-credit-1 pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-6 text-center font-mono text-[11px] uppercase tracking-[0.5em] text-bone/80 sm:text-xs">
        Nocturne Labs presents
      </p>

      {/* Title card */}
      <div className="relative z-20 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-5 text-center">
        <p className="anim-rise-1 mb-6 font-mono text-[10px] uppercase tracking-[0.45em] text-ember sm:text-[11px]">
          AI color grading · for indie filmmakers
        </p>
        <h1 className="anim-title font-display text-[15vw] font-light leading-[0.9] text-bone sm:text-[13vw] lg:text-[10.5rem]">
          NOCTURNE
        </h1>
        <p className="anim-rise-2 mt-6 max-w-xl font-display text-xl italic leading-snug text-bone/80 sm:text-2xl md:text-3xl">
          Every frame, graded like it was meant for the big screen.
        </p>
        <div className="anim-rise-3 mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <a
            href="#waitlist"
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-bone px-7 py-3.5 text-sm font-medium uppercase tracking-[0.16em] text-ink transition hover:bg-ember"
          >
            Request early access
            <span aria-hidden className="transition group-hover:translate-x-1">→</span>
          </a>
          <a
            href="#looks"
            className="inline-flex items-center gap-3 px-4 py-3.5 text-sm uppercase tracking-[0.16em] text-bone/70 transition hover:text-bone"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-bone/30">
              <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor" aria-hidden>
                <path d="M0 0 L10 6 L0 12 Z" />
              </svg>
            </span>
            See the looks
          </a>
        </div>
      </div>

      {/* Camera HUD, sits on the letterbox bars */}
      <div className="anim-rise-3 pointer-events-none absolute inset-x-0 bottom-0 z-40 flex h-[7vh] items-center justify-between px-5 font-mono text-[10px] uppercase tracking-[0.25em] text-bone/45 sm:px-8 md:h-[11vh] md:text-[11px]">
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" /> REC <Timecode />
        </span>
        <span className="hidden sm:inline">SC. 01 · TK. 03 · Look: {look.name}</span>
        <span>2.39 : 1</span>
      </div>
      <div className="anim-rise-3 pointer-events-none absolute inset-x-0 top-0 z-40 hidden h-[11vh] items-end justify-between px-8 pb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-bone/35 md:flex">
        <span>ISO 800 · 180°</span>
        <span>Arri LogC → Rec.709</span>
      </div>
    </section>
  );
}
