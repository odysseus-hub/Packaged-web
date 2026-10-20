"use client";

import { useState } from "react";
import ParticleButton from "@/components/kokonutui/particle-button";
import { Magnetic } from "@/components/motion/hover";
import { MaskedLines, Reveal } from "@/components/motion/reveal";

export function Cta() {
  const [email, setEmail] = useState("");

  // No backend in this build: resolve after a beat so the button runs its full sequence.
  // Swap for a POST to your signup endpoint.
  const signUp = () =>
    new Promise<void>((resolve, reject) =>
      setTimeout(() => (/^\S+@\S+\.\S+$/.test(email) ? resolve() : reject(new Error("email"))), 700)
    );

  return (
    <section
      id="cta"
      aria-labelledby="cta-title"
      className="relative overflow-hidden bg-brand py-[clamp(6rem,12vw,11rem)] text-brand-foreground"
    >
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
        <p className="font-mono text-[13px] font-semibold uppercase tracking-[0.18em]">
          ● Free forever for side projects · no card
        </p>
        <div id="cta-title">
          <MaskedLines
            as="h2"
            onMount={false}
            lines={["Stop hearing it", "from customers."]}
            className="mt-6 font-display text-[clamp(2.5rem,10.5vw,11rem)] uppercase leading-[0.88] tracking-[-0.01em]"
          />
        </div>
        <Reveal delay={0.25} className="mt-14 grid gap-8 lg:grid-cols-12 lg:items-end">
          <p className="max-w-[40ch] text-lg font-medium text-pretty lg:col-span-5">
            Point Relay at your API. In two minutes you&rsquo;ll have 10-second checks, a p95 dashboard and
            a status page. Your next outage gets a much shorter postmortem.
          </p>
          <form
            className="flex flex-col gap-3 sm:flex-row lg:col-span-6 lg:col-start-7"
            onSubmit={(e) => e.preventDefault()}
          >
            <label htmlFor="cta-email" className="sr-only">
              Work email
            </label>
            <input
              id="cta-email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@company.dev"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-14 w-full min-w-0 rounded-full sm:flex-1 border-2 border-brand-foreground/80 bg-transparent px-6 text-lg text-brand-foreground placeholder:text-brand-foreground/55 focus-visible:outline-brand-foreground"
            />
            <Magnetic>
              <ParticleButton
                type="submit"
                onClick={signUp}
                pendingLabel="Wiring up"
                successLabel="You're in"
                errorLabel="Add your email"
                className="h-14 w-full rounded-full bg-brand-foreground px-8 font-display text-xl uppercase tracking-wide text-brand hover:bg-brand-foreground/90 sm:w-auto"
              >
                Start monitoring
              </ParticleButton>
            </Magnetic>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
