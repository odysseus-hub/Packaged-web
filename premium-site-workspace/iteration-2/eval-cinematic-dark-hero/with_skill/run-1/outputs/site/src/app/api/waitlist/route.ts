// Waitlist stub. It validates the email and, if WAITLIST_WEBHOOK_URL is set (Zapier, Make,
// Slack, Loops, a Google Apps Script…), forwards it there. Without that env var, nothing is
// stored — wire a real destination before launch.
import { NextResponse } from "next/server";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let email = "";
  try {
    const body = (await req.json()) as { email?: unknown };
    email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  } catch {
    return NextResponse.json({ ok: false, error: "invalid body" }, { status: 400 });
  }
  if (!EMAIL.test(email) || email.length > 254) {
    return NextResponse.json({ ok: false, error: "invalid email" }, { status: 422 });
  }

  const hook = process.env.WAITLIST_WEBHOOK_URL;
  if (hook) {
    const res = await fetch(hook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, source: "nocturne-site", at: new Date().toISOString() }),
    });
    if (!res.ok) return NextResponse.json({ ok: false }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
