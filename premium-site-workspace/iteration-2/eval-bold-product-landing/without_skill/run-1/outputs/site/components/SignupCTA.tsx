"use client";

import { FormEvent, useState } from "react";

export default function SignupCTA() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setState("error");
      return;
    }
    // Wire this to your signup endpoint (e.g. POST /api/signup) before launch.
    setState("done");
  }

  return (
    <section id="signup" className="relative overflow-hidden bg-volt text-ink">
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-32">
        <p className="font-mono text-[12px] uppercase tracking-[0.2em]">Setup takes about 4 minutes</p>
        <h2 className="display mt-6 text-[clamp(3rem,12.5vw,12.5rem)]">
          Stop hearing
          <br />
          about outages
          <br />
          <span className="text-paper [-webkit-text-stroke:2px_var(--color-ink)] sm:[-webkit-text-stroke:3px_var(--color-ink)]">from users.</span>
        </h2>

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:items-end">
          <form onSubmit={onSubmit} noValidate className="lg:col-span-7" aria-describedby="signup-note">
            {state === "done" ? (
              <div role="status" className="border-2 border-ink bg-ink p-6 text-paper">
                <p className="display-tight text-3xl text-volt">You’re in.</p>
                <p className="mt-2 text-paper/80">
                  Check <span className="font-bold text-paper">{email}</span> for your login link. Your first check can be
                  running before your coffee cools.
                </p>
              </div>
            ) : (
              <>
                <label htmlFor="email" className="sr-only">
                  Work email
                </label>
                <div className="flex flex-col border-2 border-ink bg-paper sm:flex-row">
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.dev"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (state === "error") setState("idle");
                    }}
                    aria-invalid={state === "error"}
                    className="min-w-0 flex-1 bg-transparent px-5 py-5 text-lg text-ink placeholder:text-ink/40 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-ink px-8 py-5 text-lg font-extrabold uppercase tracking-wide text-paper transition-colors hover:bg-ink-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                  >
                    Start free →
                  </button>
                </div>
                <p id="signup-note" className="mt-3 font-mono text-[12px] uppercase tracking-wider text-ink/75" aria-live="polite">
                  {state === "error" ? "That email doesn’t look right. Try again." : "Free for 5 endpoints. No card. No sales call."}
                </p>
              </>
            )}
          </form>
          <ul className="grid grid-cols-3 gap-px border-2 border-ink bg-ink lg:col-span-5">
            {[
              { k: "6.8s", v: "median alert" },
              { k: "14", v: "regions" },
              { k: "$0", v: "to start" },
            ].map((s) => (
              <li key={s.k} className="bg-volt p-4">
                <div className="display-tight text-3xl tabular sm:text-4xl">{s.k}</div>
                <div className="mt-1 font-mono text-[11px] uppercase tracking-wider">{s.v}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
