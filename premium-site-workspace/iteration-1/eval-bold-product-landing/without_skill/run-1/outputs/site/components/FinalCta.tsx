"use client";

import { useState } from "react";

export function FinalCta() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <section id="signup" className="relative overflow-hidden bg-signal text-ink">
      <div className="grain pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1440px] px-4 py-20 sm:px-8 sm:py-32">
        <p className="mb-8 font-mono text-xs font-bold uppercase tracking-[0.2em]">05 / Get loud</p>
        <h2 className="display text-[clamp(3rem,11vw,11rem)]">
          Stop finding out <span className="text-bone [-webkit-text-stroke:2px_var(--color-ink)] sm:[-webkit-text-stroke:3px_var(--color-ink)]">from Twitter.</span>
        </h2>

        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:items-center">
          <p className="max-w-xl text-lg font-medium leading-snug sm:text-2xl lg:col-span-5">
            Your first 10 endpoints are free forever. Setup takes 90 seconds. The first alert takes under 10.
          </p>
          <div className="lg:col-span-7">
            {sent ? (
              <div role="status" className="rounded-3xl border-2 border-ink bg-ink p-6 text-bone sm:p-8">
                <p className="display-tight text-3xl text-signal sm:text-4xl">You&apos;re in.</p>
                <p className="mt-2 font-mono text-sm">
                  Magic link sent to <span className="text-signal">{email}</span>. Run{" "}
                  <code className="rounded bg-ink-3 px-1.5 py-0.5">npx relay init</code> while you wait.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                className="flex flex-col gap-3 rounded-[2rem] border-2 border-ink bg-bone p-2 shadow-[10px_10px_0_0_var(--color-ink)] sm:flex-row"
              >
                <label htmlFor="email" className="sr-only">
                  Work email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@yourteam.dev"
                  className="min-w-0 flex-1 rounded-full bg-transparent px-5 py-4 font-mono text-base text-ink placeholder:text-ink/40 focus:outline-none sm:text-lg"
                />
                <button
                  type="submit"
                  className="rounded-full bg-ink px-8 py-4 font-mono text-sm font-bold uppercase tracking-wider text-bone transition hover:bg-signal-dark"
                >
                  Start monitoring →
                </button>
              </form>
            )}
            <p className="mt-5 font-mono text-xs font-bold uppercase tracking-wider text-ink/70">
              No credit card · SOC 2 Type II · Data in US or EU
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
