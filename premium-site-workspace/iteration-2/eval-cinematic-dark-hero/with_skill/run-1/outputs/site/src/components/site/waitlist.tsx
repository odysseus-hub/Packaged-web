"use client";

import { useId, useRef, useState } from "react";
import ParticleButton from "@/components/kokonutui/particle-button";
import { Magnetic } from "@/components/motion/hover";
import { MaskedLines, Reveal } from "@/components/motion/reveal";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Waitlist() {
  const formRef = useRef<HTMLFormElement>(null);
  const inputId = useId();
  const [message, setMessage] = useState<string>("");

  async function join() {
    const form = formRef.current;
    if (!form) return;
    const email = String(new FormData(form).get("email") ?? "").trim();
    if (!EMAIL.test(email)) {
      setMessage("That email doesn’t look right — check it and try again.");
      throw new Error("invalid email");
    }
    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      setMessage("Something went wrong on our side. Please try again.");
      throw new Error("request failed");
    }
    setMessage("You’re on the list. We’ll write when your seat is ready.");
    form.reset();
  }

  return (
    <section
      id="waitlist"
      className="section-pad relative overflow-hidden border-t border-hairline bg-[oklch(0.1_0.006_60)]"
    >
      {/* A single warm key light from above — the end of the reel. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[70%] bg-[radial-gradient(ellipse_45%_60%_at_50%_0%,oklch(0.79_0.135_68/0.16),transparent_70%)]"
      />
      <div className="container-x relative text-center">
        <p className="slate text-brand">Waitlist</p>
        <MaskedLines
          as="h2"
          onMount={false}
          lines={["Fade in."]}
          className="mt-6 font-display text-[clamp(5rem,17vw,15rem)] leading-[0.85] tracking-[-0.04em] italic"
        />
        <Reveal delay={0.3}>
          <p className="mx-auto mt-8 max-w-[44ch] text-lg leading-relaxed text-pretty text-muted-foreground">
            Nocturne is opening to independent filmmakers in small batches. Leave your email and
            we&rsquo;ll send one message: the day your seat is ready.
          </p>

          <form
            ref={formRef}
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              join().catch(() => {});
            }}
            className="mx-auto mt-12 flex max-w-xl flex-col items-stretch gap-3 sm:flex-row sm:items-center"
          >
            <label htmlFor={inputId} className="sr-only">
              Email address
            </label>
            <input
              id={inputId}
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@yourfilm.com"
              className="h-12 flex-1 rounded-full border border-hairline bg-surface px-6 text-base text-foreground placeholder:text-muted-foreground/70 focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
            />
            <Magnetic className="self-center">
              <ParticleButton
                onClick={() => join()}
                pendingLabel="Saving your seat"
                successLabel="You’re in"
                errorLabel="Try again"
                className="h-12 rounded-full bg-brand px-7 text-[0.95rem] font-medium text-brand-foreground hover:bg-brand hover:brightness-110 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Join the waitlist
              </ParticleButton>
            </Magnetic>
          </form>
          <p role="status" aria-live="polite" className="mt-5 min-h-6 text-sm text-muted-foreground">
            {message}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
