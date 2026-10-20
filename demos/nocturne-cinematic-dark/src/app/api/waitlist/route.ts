import { NextResponse } from "next/server";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Waitlist endpoint. Validates the address and acknowledges it.
 * TODO before launch: persist `email` to your list provider (Resend Audiences, Loops,
 * ConvertKit, a Vercel Marketplace database…) using a server-side env var.
 */
export async function POST(request: Request) {
  let email = "";
  try {
    const body = (await request.json()) as { email?: unknown };
    email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
  if (!EMAIL.test(email) || email.length > 254) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email" }, { status: 422 });
  }
  return NextResponse.json({ ok: true });
}
