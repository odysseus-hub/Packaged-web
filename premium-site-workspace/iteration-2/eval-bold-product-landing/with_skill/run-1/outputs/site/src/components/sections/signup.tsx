"use client";

import { type FormEvent, useRef } from "react";
import ParticleButton from "@/components/kokonutui/particle-button";
import { Magnetic } from "@/components/motion/hover";
import { MaskedLines, Reveal } from "@/components/motion/reveal";

export function Signup() {
  const inputRef = useRef<HTMLInputElement>(null);

  async function submit() {
    const input = inputRef.current;
    if (!input || !input.checkValidity()) {
      input?.reportValidity();
      throw new Error("invalid email");
    }
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: input.value }),
    });
    if (!res.ok) throw new Error("signup failed");
    input.value = "";
  }

  // particle-button renders type="button"; route Enter through it so keyboard submit
  // gets the same pending → success states.
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.currentTarget.querySelector<HTMLButtonElement>("button[data-status]")?.click();
  }

  return (
    <section
      id="signup"
      aria-labelledby="signup-title"
      className="grain relative overflow-hidden bg-brand py-[clamp(6rem,12vw,11rem)] text-brand-foreground"
    >
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em]">Free for your first 10 endpoints</p>
        <div id="signup-title" className="mt-6">
          <MaskedLines
            as="h2"
            onMount={false}
            lines={["Stop hearing", "about outages", "from customers."]}
            className="font-display text-[clamp(3.25rem,11vw,12rem)] uppercase leading-[0.86] tracking-[-0.01em]"
          />
        </div>

        <Reveal delay={0.2} className="mt-14 grid gap-10 lg:grid-cols-12 lg:items-end">
          <form onSubmit={onSubmit} noValidate={false} className="lg:col-span-7">
            <label htmlFor="email" className="font-mono text-xs font-semibold uppercase tracking-[0.18em]">
              Work email
            </label>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <input
                ref={inputRef}
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@company.dev"
                className="h-14 w-full min-w-0 border-2 sm:w-auto sm:flex-1 border-brand-foreground bg-transparent px-4 text-lg text-brand-foreground placeholder:text-brand-foreground/55 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-foreground/30"
              />
              <Magnetic className="sm:shrink-0">
                <ParticleButton
                  onClick={submit}
                  pendingLabel="Creating workspace"
                  successLabel="Check your inbox"
                  errorLabel="Check that email"
                  className="h-14 rounded-none bg-brand-foreground px-7 font-mono text-sm font-semibold uppercase tracking-[0.14em] text-brand hover:bg-brand-foreground/90 focus-visible:ring-4 focus-visible:ring-brand-foreground/30"
                >
                  Get paged first →
                </ParticleButton>
              </Magnetic>
            </div>
          </form>
          <p className="max-w-[40ch] text-base leading-relaxed lg:col-span-4 lg:col-start-9">
            No card. Two minutes to your first check. Leave whenever — deleting your account
            deletes your data, the same day.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
