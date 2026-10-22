// Signup stub. Validates the email and, if SIGNUP_WEBHOOK_URL is set, forwards it there
// (Zapier, Slack incoming webhook, your CRM…). It stores nothing itself.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let email = "";
  try {
    const body = (await request.json()) as { email?: unknown };
    email = typeof body.email === "string" ? body.email.trim() : "";
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  if (!EMAIL.test(email) || email.length > 254) {
    return Response.json({ ok: false, error: "Invalid email" }, { status: 422 });
  }

  const hook = process.env.SIGNUP_WEBHOOK_URL;
  if (hook) {
    const res = await fetch(hook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, source: "relay-landing", at: new Date().toISOString() }),
    });
    if (!res.ok) return Response.json({ ok: false }, { status: 502 });
  }
  return Response.json({ ok: true });
}
