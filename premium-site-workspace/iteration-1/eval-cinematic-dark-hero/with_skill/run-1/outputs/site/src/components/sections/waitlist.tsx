"use client";

import { ArrowRight } from "lucide-react";
import { type FormEvent, useRef, useState } from "react";
import ParticleButton from "@/components/kokonutui/particle-button";
import { Magnetic } from "@/components/motion/hover";
import { MaskedLines, Reveal } from "@/components/motion/reveal";
import { Eyebrow } from "./section-heading";

export function Waitlist() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function join() {
    setMessage(null);
    const form = formRef.current;
    if (form && !form.reportValidity()) {
      throw new Error("invalid");
    }
    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
    if (!res.ok || !data.ok) {
      setMessage({ tone: "error", text: data.error ?? "Something went wrong — try again." });
      throw new Error(data.error ?? "failed");
    }
    setMessage({ tone: "ok", text: "You’re on the list. We’ll write when your seat in the screening room is ready." });
    setEmail("");
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    // Enter in the field should behave exactly like pressing the button (spinner, burst).
    document.getElementById("waitlist-submit")?.click();
  }

  return (
    <section id="waitlist" className="section-pad relative overflow-hidden border-t border-hairline">
      {/* One more light source: the projector beam returns for the end credits. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_55%_at_50%_100%,oklch(0.8_0.135_72/0.14),transparent_70%)]"
      />
      <div className="container-x flex flex-col items-center text-center">
        <Reveal>
          <Eyebrow reel="08" className="justify-center">
            Early access
          </Eyebrow>
        </Reveal>
        <MaskedLines
          as="h2"
          onMount={false}
          delay={0.1}
          lines={["Your film deserves", <>a <em className="text-brand">premiere</em> grade.</>]}
          className="mt-8 font-display text-[clamp(3rem,8.5vw,8.5rem)] leading-[0.92] tracking-[-0.035em] text-balance"
        />
        <Reveal delay={0.35} className="mt-10 w-full max-w-xl">
          <p className="mx-auto max-w-[46ch] text-lg leading-relaxed text-pretty text-muted-foreground">
            Join the waitlist for early access and a year of launch pricing. One
            email when your seat is ready — nothing else.
          </p>
          <form
            ref={formRef}
            onSubmit={onSubmit}
            noValidate={false}
            className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
          >
            <label htmlFor="waitlist-email" className="sr-only">
              Email address
            </label>
            <input
              id="waitlist-email"
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              placeholder="you@yourfilm.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-describedby="waitlist-status"
              className="h-12 w-full rounded-full sm:flex-1 border border-input bg-surface/70 px-5 text-base text-foreground outline-none placeholder:text-muted-foreground/70 focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/40"
            />
            <Magnetic className="sm:shrink-0">
              <ParticleButton
                id="waitlist-submit"
                onClick={join}
                pendingLabel="Reserving"
                successLabel="You’re in"
                errorLabel="Try again"
                icon={<ArrowRight aria-hidden="true" />}
                className="h-12 w-full rounded-full bg-brand px-6 text-[0.95rem] text-brand-foreground hover:bg-brand/90 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Join the waitlist
              </ParticleButton>
            </Magnetic>
          </form>
          <p
            id="waitlist-status"
            role="status"
            className={
              message?.tone === "error"
                ? "mt-4 min-h-6 text-sm text-red-300"
                : "mt-4 min-h-6 text-sm text-muted-foreground"
            }
          >
            {message?.text ?? ""}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
