"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "done" | "error";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Director / DP");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setMessage("That email doesn't look quite right.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });
      const data = (await res.json()) as { ok: boolean; message?: string };
      if (!res.ok || !data.ok) throw new Error(data.message || "Something went wrong.");
      setStatus("done");
      setMessage("You're on the list. We'll send your invite before the premiere.");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "done") {
    return (
      <div className="mx-auto max-w-xl rounded-sm border border-ember/40 bg-ink-2/80 p-8 text-center" role="status">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ember">That&apos;s a wrap</p>
        <p className="mt-3 font-display text-2xl text-bone">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-2xl" noValidate>
      <div className="flex flex-col gap-3 rounded-sm border border-line bg-ink-2/80 p-2 backdrop-blur sm:flex-row">
        <label className="sr-only" htmlFor="wl-email">Email address</label>
        <input
          id="wl-email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@yourfilm.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          aria-invalid={status === "error"}
          aria-describedby="wl-msg"
          className="min-w-0 flex-1 bg-transparent px-4 py-3 text-bone placeholder:text-mute/70 focus:outline-none"
        />
        <label className="sr-only" htmlFor="wl-role">Your role</label>
        <select
          id="wl-role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="rounded-sm border border-line bg-ink-3 px-3 py-3 text-sm text-bone/80 focus:border-ember focus:outline-none"
        >
          <option>Director / DP</option>
          <option>Editor</option>
          <option>Colorist</option>
          <option>Producer</option>
          <option>Student</option>
        </select>
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-sm bg-ember px-6 py-3 text-sm font-medium uppercase tracking-[0.16em] text-ink transition hover:bg-bone disabled:opacity-60"
        >
          {status === "loading" ? "Rolling…" : "Join the waitlist"}
        </button>
      </div>
      <p id="wl-msg" className={`mt-3 min-h-5 text-sm ${status === "error" ? "text-ember-2" : "text-mute"}`} aria-live="polite">
        {status === "error" ? message : "No spam. One email when your seat opens. Early access members get Pro free for 3 months."}
      </p>
    </form>
  );
}
