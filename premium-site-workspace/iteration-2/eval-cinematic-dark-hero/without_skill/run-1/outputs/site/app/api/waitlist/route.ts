import { NextResponse } from "next/server";

// Minimal waitlist endpoint. Swap the TODO for your ESP / database of choice
// (Resend, Loops, ConvertKit, Supabase, Vercel KV...) before launch.
export async function POST(req: Request) {
  let body: { email?: unknown; role?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 422 });
  }
  const role = typeof body.role === "string" ? body.role.slice(0, 40) : "unknown";

  // TODO: persist { email, role } somewhere durable.
  console.log("[waitlist]", { email, role, at: new Date().toISOString() });

  return NextResponse.json({ ok: true, message: `We'll write to ${email} when your seat opens.` });
}
