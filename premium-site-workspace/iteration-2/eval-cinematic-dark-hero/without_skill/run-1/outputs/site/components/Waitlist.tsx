"use client";
import { useState } from "react";

type State = "idle" | "loading" | "done" | "error";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Director / DP");
  const [state, setState] = useState<State>("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState("error");
      setMsg("That address doesn't look right. Try again?");
      return;
    }
    setState("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setState("done");
      setMsg(data.message);
    } catch (err) {
      setState("error");
      setMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (state === "done") {
    return (
      <div className="mx-auto max-w-xl rounded-sm border border-amber/30 bg-amber/5 px-6 py-8 text-center" role="status">
        <p className="font-mono text-[11px] tracking-[0.25em] text-amber uppercase">You&apos;re on the call sheet</p>
        <p className="mt-3 font-display text-3xl">See you at the premiere.</p>
        <p className="mt-2 text-sm text-smoke">{msg}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="mx-auto w-full max-w-xl">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="wl-email">Email address</label>
        <input
          id="wl-email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@yourfilm.com"
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (state === "error") setState("idle"); }}
          aria-invalid={state === "error"}
          aria-describedby="wl-msg"
          className="h-12 flex-1 rounded-sm border border-white/15 bg-white/[0.03] px-4 text-bone placeholder:text-smoke/60 outline-none transition focus:border-amber/70 focus:bg-white/[0.05]"
        />
        <label className="sr-only" htmlFor="wl-role">I am a</label>
        <select
          id="wl-role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="h-12 rounded-sm border border-white/15 bg-night px-3 text-sm text-bone outline-none focus:border-amber/70"
        >
          <option>Director / DP</option>
          <option>Editor</option>
          <option>Colorist</option>
          <option>Producer</option>
          <option>Student</option>
        </select>
        <button
          type="submit"
          disabled={state === "loading"}
          className="h-12 whitespace-nowrap rounded-sm bg-amber px-6 text-sm font-medium tracking-wide text-ink transition hover:bg-[#f2b673] disabled:opacity-60"
        >
          {state === "loading" ? "Rolling…" : "Join the waitlist"}
        </button>
      </div>
      <p id="wl-msg" className={`mt-3 min-h-5 text-center text-sm ${state === "error" ? "text-ember" : "text-smoke"}`} aria-live="polite">
        {state === "error" ? msg : "Early access rolls out in batches. No spam — one email when your seat is ready."}
      </p>
    </form>
  );
}
