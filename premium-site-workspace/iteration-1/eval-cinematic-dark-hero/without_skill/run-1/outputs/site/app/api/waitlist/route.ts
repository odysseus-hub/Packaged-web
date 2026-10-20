import { NextResponse } from "next/server";

/**
 * Waitlist endpoint. Validates the payload and logs it. To persist signups,
 * forward to your provider of choice (Resend audience, ConvertKit, a database,
 * etc.) — e.g. set WAITLIST_WEBHOOK_URL in Vercel and it will be POSTed to.
 */
export async function POST(req: Request) {
  let body: { email?: unknown; role?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const role = typeof body.role === "string" ? body.role.slice(0, 64) : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return NextResponse.json({ ok: false, message: "Please enter a valid email." }, { status: 422 });
  }

  const hook = process.env.WAITLIST_WEBHOOK_URL;
  if (hook) {
    try {
      await fetch(hook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role, at: new Date().toISOString() }),
      });
    } catch {
      return NextResponse.json({ ok: false, message: "Couldn't save right now — try again." }, { status: 502 });
    }
  } else {
    console.log("[waitlist]", email, role);
  }

  return NextResponse.json({ ok: true });
}
